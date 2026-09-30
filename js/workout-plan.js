/* =========================================================

   SPORTHUB WORKOUT PLAN PAGE

   Version 1.3

   Dùng cho:

   - ke-hoach-tap-luyen.html

   - js/workout-session.js

   - js/exercise-media.js

   Nhiệm vụ:

   - Đọc dữ liệu đã lưu từ Fitness Check

   - Không chạy lại Health Engine / Workout Engine

   - Render tổng quan và lịch tập 7 ngày

   - Kiểm tra Safety Gate

   - Nhận diện video bài tập

   - Bắt đầu / tiếp tục Workout Session

========================================================= */

window.SportHubWorkoutPlanPage = (() => {

    "use strict";

    /* =====================================================

       1. STORAGE

    ====================================================== */

    const STORAGE = {

        profile:

            "sporthub_fitness_profile",

        health:

            "sporthub_fitness_analysis",

        workout:

            "sporthub_workout_plan",

        activeSession:

            "sporthub_workout_active_session"

    };

    /* =====================================================

       2. DAY NAMES

    ====================================================== */

    const DAY_NAMES = [

        "Thứ Hai",

        "Thứ Ba",

        "Thứ Tư",

        "Thứ Năm",

        "Thứ Sáu",

        "Thứ Bảy",

        "Chủ Nhật"

    ];

    /* =====================================================

       3. GOAL NAMES

    ====================================================== */

    const GOAL_NAMES = {

        fatloss:

            "Giảm mỡ",

        muscle:

            "Tăng cơ",

        strength:

            "Tăng sức mạnh",

        endurance:

            "Tăng sức bền",

        fitness:

            "Cải thiện thể lực",

        mobility:

            "Tăng linh hoạt",

        maintenance:

            "Duy trì thể trạng"

    };

    /* =====================================================

       4. RECOVERY LABELS

    ====================================================== */

    const RECOVERY_LABELS = {

        normal:

            "Bình thường",

        caution:

            "Cần theo dõi",

        reduce:

            "Giảm khối lượng"

    };

    /* =====================================================

       5. SESSION TYPE NAMES

    ====================================================== */

    const SESSION_TYPE_NAMES = {

        Strength:

            "Sức mạnh",

        Cardio:

            "Cardio",

        Mobility:

            "Mobility",

        Recovery:

            "Phục hồi",

        "Full Body":

            "Toàn thân",

        Upper:

            "Thân trên",

        Lower:

            "Thân dưới"

    };

    /* =====================================================

       6. MEDIA ALIASES

    ====================================================== */

    const MEDIA_ALIASES = {

        pushup:

            "push-up",

        "push-up":

            "push-up",

        "knee-pushup":

            "knee-push-up",

        "dumbbell-row":

            "dumbbell-bent-over-row",

        "shoulder-press":

            "dumbbell-shoulder-press",

        "hip-thrust-glute-bridge":

            "glute-bridge",

        "hip-thrust":

            "glute-bridge"

    };

    /* =====================================================

       7. RUNTIME

    ====================================================== */

    let root =

        null;

    let eventsBound =

        false;

    /* =====================================================

       8. SAFE JSON

    ====================================================== */

    function safeParse(

        value

    ) {

        if (!value) {

            return null;

        }

        try {

            return JSON.parse(

                value

            );

        }

        catch (error) {

            return null;

        }

    }

    function readStorage(

        key

    ) {

        try {

            return safeParse(

                localStorage.getItem(

                    key

                )

            );

        }

        catch (error) {

            return null;

        }

    }

    /* =====================================================

       9. HTML ESCAPE

    ====================================================== */

    function escapeHTML(

        value

    ) {

        return String(

            value ?? ""

        )

            .replace(

                /&/g,

                "&amp;"

            )

            .replace(

                /</g,

                "&lt;"

            )

            .replace(

                />/g,

                "&gt;"

            )

            .replace(

                /"/g,

                "&quot;"

            )

            .replace(

                /'/g,

                "&#039;"

            );

    }

    /* =====================================================

       10. SLUG

    ====================================================== */

    function slug(

        value

    ) {

        return String(

            value || ""

        )

            .normalize(

                "NFD"

            )

            .replace(

                /[\u0300-\u036f]/g,

                ""

            )

            .replace(

                /đ/g,

                "d"

            )

            .replace(

                /Đ/g,

                "d"

            )

            .toLowerCase()

            .trim()

            .replace(

                /[^a-z0-9]+/g,

                "-"

            )

            .replace(

                /^-+|-+$/g,

                ""

            );

    }

    /* =====================================================

       11. MESSAGE

    ====================================================== */

    function notify(

        text

    ) {

        if (

            typeof window.toast ===

            "function"

        ) {

            window.toast(

                text

            );

            return;

        }

        window.alert(

            text

        );

    }

/* =====================================================

   12. STORAGE GETTERS

   Ưu tiên dùng SportHubPersonalPlan.

   Nếu personal-plan.js chưa load được

   thì fallback về localStorage cũ.

====================================================== */

function getProfile() {

    if (

        window

            .SportHubPersonalPlan

            ?.getProfile

    ) {

        return window

            .SportHubPersonalPlan

            .getProfile();

    }

    return readStorage(

        STORAGE.profile

    );

}

function getHealth() {

    if (

        window

            .SportHubPersonalPlan

            ?.getHealth

    ) {

        return window

            .SportHubPersonalPlan

            .getHealth();

    }

    return readStorage(

        STORAGE.health

    );

}

function getWorkout() {

    if (

        window

            .SportHubPersonalPlan

            ?.getWorkout

    ) {

        return window

            .SportHubPersonalPlan

            .getWorkout();

    }

    return readStorage(

        STORAGE.workout

    );

}

    /* =====================================================

       13. TODAY INDEX

       JS:

       0 = Chủ Nhật

       SPORTHUB:

       0 = Thứ Hai

    ====================================================== */

    function getTodayIndex() {

        return (

            new Date()

                .getDay()

            +

            6

        )

        %

        7;

    }

    /* =====================================================

       14. ARIA BUSY

    ====================================================== */

    function setBusy(

        value

    ) {

        if (!root) {

            return;

        }

        root.setAttribute(

            "aria-busy",

            value

                ? "true"

                : "false"

        );

    }

    /* =====================================================

       15. LABEL HELPERS

    ====================================================== */

    function getGoalName(

        goal

    ) {

        return (

            GOAL_NAMES[

                goal

            ]

            ||

            "Theo Fitness Check"

        );

    }

    function getRecoveryLabel(

        level

    ) {

        return (

            RECOVERY_LABELS[

                level

            ]

            ||

            "Theo kế hoạch"

        );

    }

    function getSessionTypeName(

        type

    ) {

        return (

            SESSION_TYPE_NAMES[

                type

            ]

            ||

            type

            ||

            "Workout"

        );

    }

    /* =====================================================

       16. SAFETY

    ====================================================== */

    function isSafetyBlocked(

        health,

        workout

    ) {

        return (

            health

                ?.safety

                ?.allowFullAutomation

            ===

            false

        )

        ||

        (

            workout

                ?.blocked

            ===

            true

        );

    }

    /* =====================================================

       17. SCHEDULE

    ====================================================== */

    function getSchedule(

        workout

    ) {

        return Array.isArray(

            workout

                ?.schedule

        )

            ? workout.schedule

            : [];

    }

    function normalizeWeek(

        workout

    ) {

        const schedule =

            getSchedule(

                workout

            );

        return Array.from(

            {

                length:

                    7

            },

            (

                _,

                index

            ) => {

                return (

                    schedule[

                        index

                    ]

                    ||

                    {

                        name:

                            "Phục hồi",

                        type:

                            "Recovery",

                        recommendations:

                            []

                    }

                );

            }

        );

    }

    /* =====================================================

       18. COUNT TRAINING DAYS

    ====================================================== */

    function countTrainingDays(

        schedule

    ) {

        return schedule

            .filter(

                item => {

                    return (

                        item

                        &&

                        item.type !==

                        "Recovery"

                        &&

                        Array.isArray(

                            item.exercises

                        )

                        &&

                        item.exercises.length > 0

                    );

                }

            )

            .length;

    }

    /* =====================================================

       19. COUNT EXERCISES

    ====================================================== */

    function countExercises(

        schedule

    ) {

        return schedule

            .reduce(

                (

                    total,

                    session

                ) => {

                    if (

                        !Array.isArray(

                            session

                                ?.exercises

                        )

                    ) {

                        return total;

                    }

                    return (

                        total

                        +

                        session.exercises

                            .filter(Boolean)

                            .length

                    );

                },

                0

            );

    }

    /* =====================================================

       20. SAVED SESSION

    ====================================================== */

    function hasSavedSession() {

        const sessionAPI =

            window

                .SportHubWorkoutSession;

        if (

            sessionAPI

            &&

            typeof sessionAPI

                .hasSavedSession

            ===

            "function"

        ) {

            return sessionAPI

                .hasSavedSession();

        }

        return Boolean(

            readStorage(

                STORAGE.activeSession

            )

        );

    }

    /* =====================================================

       21. LEGACY PLAN CHECK

    ====================================================== */

    function isLegacyPlan(

        workout

    ) {

        if (!workout) {

            return false;

        }

        if (

            String(

                workout.engine || ""

            )

                .toLowerCase()

                .includes(

                    "v2.0"

                )

        ) {

            return false;

        }

        const exercises =

            getSchedule(

                workout

            )

                .flatMap(

                    session => {

                        return Array.isArray(

                            session

                                ?.exercises

                        )

                            ? session.exercises

                            : [];

                    }

                );

        if (

            !exercises.length

        ) {

            return false;

        }

        return exercises.some(

            exercise =>

                !exercise

                    ?.exerciseId

        );

    }

    /* =====================================================

       22. MEDIA KEY

       Hỗ trợ cả:

       bodyweight-squat

       bodyweightSquat

    ====================================================== */

    function normalizeMediaKey(

        value

    ) {

        const withWordBreaks =

            String(

                value || ""

            )

                .replace(

                    /([a-z0-9])([A-Z])/g,

                    "$1-$2"

                );

        const normalized =

            slug(

                withWordBreaks

            );

        return (

            MEDIA_ALIASES[

                normalized

            ]

            ||

            normalized

        );

    }
    /* =====================================================

       23. NORMALIZE MEDIA

    ====================================================== */

    function normalizeMediaEntry(

        found

    ) {

        if (!found) {

            return null;

        }

        if (

            typeof found ===

            "string"

        ) {

            return {

                video:

                    found

            };

        }

        if (

            typeof found ===

            "object"

            &&

            found.video

        ) {

            return found;

        }

        return null;

    }

    /* =====================================================

       24. FIND MEDIA IN LIBRARY

    ====================================================== */

    function findMediaInLibrary(

        library,

        key

    ) {

        if (

            !library

            ||

            typeof library !==

            "object"

            ||

            !key

        ) {

            return null;

        }

        const direct =

            normalizeMediaEntry(

                library[

                    key

                ]

            );

        if (direct) {

            return direct;

        }

        const matchedKey =

            Object.keys(

                library

            )

                .find(

                    libraryKey => {

                        return (

                            normalizeMediaKey(

                                libraryKey

                            )

                            ===

                            key

                        );

                    }

                );

        if (!matchedKey) {

            return null;

        }

        return normalizeMediaEntry(

            library[

                matchedKey

            ]

        );

    }

    /* =====================================================

       25. GET EXERCISE MEDIA

       Thứ tự ưu tiên:

       1. exercise.video

       2. exercise-media.js

       3. workout-session.js media registry

    ====================================================== */

    function getExerciseMedia(

        exercise

    ) {

        if (!exercise) {

            return null;

        }

        if (

            exercise.video

        ) {

            return {

                video:

                    exercise.video

            };

        }

        const externalLibrary =

            window

                .SportHubExerciseMedia

            ||

            {};

        const sessionLibrary =

            window

                .SportHubWorkoutSession

                ?.media

            ||

            {};

        const candidates = [

            exercise.exerciseId,

            exercise.mediaKey,

            exercise.name

        ]

            .filter(

                Boolean

            )

            .map(

                normalizeMediaKey

            );

        for (

            const key of

            candidates

        ) {

            const external =

                findMediaInLibrary(

                    externalLibrary,

                    key

                );

            if (external) {

                return external;

            }

            const sessionMedia =

                findMediaInLibrary(

                    sessionLibrary,

                    key

                );

            if (sessionMedia) {

                return sessionMedia;

            }

        }

        return null;

    }

    /* =====================================================

       26. FORMAT SECONDS

    ====================================================== */

    function formatSeconds(

        seconds

    ) {

        const value =

            Number(

                seconds

            );

        if (

            !Number.isFinite(

                value

            )

            ||

            value <= 0

        ) {

            return "";

        }

        if (

            value >= 60

            &&

            value % 60 ===

            0

        ) {

            const minutes =

                value / 60;

            return `${minutes} phút`;

        }

        return `${Math.round(value)} giây`;

    }

    /* =====================================================

       27. EXERCISE META

    ====================================================== */

    function getExerciseMeta(

        exercise

    ) {

        const parts =

            [];

        const sets =

            Number.parseInt(

                exercise

                    ?.sets,

                10

            );

        if (

            Number.isFinite(

                sets

            )

            &&

            sets > 0

        ) {

            parts.push(

                `${sets} set`

            );

        }

        if (

            exercise

                ?.reps

        ) {

            parts.push(

                String(

                    exercise.reps

                )

            );

        }

        else if (

            exercise

                ?.durationSeconds

        ) {

            const duration =

                formatSeconds(

                    exercise

                        .durationSeconds

                );

            if (duration) {

                parts.push(

                    duration

                );

            }

        }

        if (

            exercise

                ?.rest

        ) {

            parts.push(

                `nghỉ ${exercise.rest}`

            );

        }

        else if (

            exercise

                ?.restSeconds

            !==

            undefined

        ) {

            const rest =

                Number(

                    exercise

                        .restSeconds

                );

            if (

                Number.isFinite(

                    rest

                )

                &&

                rest > 0

            ) {

                parts.push(

                    `nghỉ ${formatSeconds(rest)}`

                );

            }

        }

        return parts.join(

            " · "

        );

    }

    /* =====================================================

       28. SUMMARY

    ====================================================== */

    function buildSummaryHTML(

        profile,

        workout

    ) {

        const schedule =

            getSchedule(

                workout

            );

        const trainingDays =

            countTrainingDays(

                schedule

            );

        const exerciseCount =

            countExercises(

                schedule

            );

        const split =

            workout

                ?.strategy

                ?.split

            ||

            "Theo kế hoạch";

        const recovery =

            workout

                ?.recoveryAdjustment

                ?.level;

        return `

            <section

                class="workout-plan-summary"

                aria-labelledby="workoutDynamicSummaryTitle"

            >

                <div class="workout-plan-summary-head">

                    <div>

                        <span class="eyebrow">

                            TỔNG QUAN

                        </span>

                        <h2 id="workoutDynamicSummaryTitle">

                            Kế hoạch tập luyện của bạn

                        </h2>

                    </div>

                    <p>

                        Lịch bên dưới được đọc từ kết quả

                        Fitness Check gần nhất trên thiết bị này.

                    </p>

                </div>

                <div class="workout-plan-summary-grid">

                    <article class="workout-summary-card highlight">

                        <span>

                            Buổi tập / tuần

                        </span>

                        <strong>

                            ${trainingDays}

                        </strong>

                    </article>

                    <article class="workout-summary-card">

                        <span>

                            Cách chia lịch

                        </span>

                        <strong>

                            ${escapeHTML(split)}

                        </strong>

                    </article>

                    <article class="workout-summary-card">

                        <span>

                            Mục tiêu

                        </span>

                        <strong>

                            ${escapeHTML(

                                getGoalName(

                                    profile

                                        ?.goal

                                        ?.primary

                                )

                            )}

                        </strong>

                    </article>

                    <article class="workout-summary-card">

                        <span>

                            Phục hồi

                        </span>

                        <strong>

                            ${escapeHTML(

                                getRecoveryLabel(

                                    recovery

                                )

                            )}

                        </strong>

                    </article>

                </div>

<p class="workout-plan-summary-note">

    Tổng số lượt bài trong tuần:

    <strong>

        ${exerciseCount}

    </strong>

</p>

            </section>

        `;

    }

    /* =====================================================

       29. SAFETY NOTICE

    ====================================================== */

    function buildSafetyHTML(

        health,

        workout

    ) {

        if (

            isSafetyBlocked(

                health,

                workout

            )

        ) {

            const reason =

                workout

                    ?.reason

                ||

                health

                    ?.safety

                    ?.message

                ||

                "Safety Gate hiện chưa cho phép chạy kế hoạch tập luyện tự động.";

            return `

                <div class="workout-plan-notice stop">

                    <h3>

                        Kế hoạch tập đang được tạm khóa

                    </h3>

                    <p>

                        ${escapeHTML(reason)}

                    </p>

<p class="workout-plan-notice-followup">

    Hãy xem lại kết quả Fitness Check

    trước khi bắt đầu buổi tập.

</p>

                </div>

            `;

        }

        if (

            health

                ?.safety

                ?.level

            ===

            "caution"

        ) {

            return `

                <div class="workout-plan-notice caution">

                    <h3>

                        Lưu ý trước khi tập

                    </h3>

                    <p>

                        Fitness Check đang có trạng thái

                        cần thận trọng.

                        Hãy giữ cường độ trong vùng kiểm soát

                        và dừng bài tập nếu xuất hiện

                        triệu chứng bất thường hoặc

                        triệu chứng tăng lên.

                    </p>

                </div>

            `;

        }

        return `

            <div class="workout-plan-notice">

                <h3>

                    Kế hoạch tập đã sẵn sàng

                </h3>

                <p>

                    Kế hoạch được tạo từ dữ liệu

                    Fitness Check hiện có.

                    Đây không phải công cụ chẩn đoán y khoa.

                    Dừng bài tập nếu xuất hiện đau sắc,

                    chóng mặt, khó thở bất thường

                    hoặc triệu chứng đáng lo ngại.

                </p>

            </div>

        `;

    }

    /* =====================================================

       30. RECOVERY NOTICE

    ====================================================== */

    function buildRecoveryHTML(

        workout

    ) {

        const recovery =

            workout

                ?.recoveryAdjustment;

        if (

            !recovery

                ?.message

        ) {

            return "";

        }

        const className =

            [

                "reduce",

                "caution"

            ]

                .includes(

                    recovery.level

                )

                ? "caution"

                : "";

        return `

            <div

                class="workout-plan-notice ${className}"

            >

                <h3>

                    Điều chỉnh theo khả năng phục hồi

                </h3>

                <p>

                    ${escapeHTML(

                        recovery.message

                    )}

                </p>

            </div>

        `;

    }

    /* =====================================================

       31. LEGACY PLAN NOTICE

    ====================================================== */

    function buildLegacyHTML(

        workout

    ) {

        if (

            !isLegacyPlan(

                workout

            )

        ) {

            return "";

        }

        return `

            <div class="workout-plan-notice caution">

                <h3>

                    Bạn đang xem kế hoạch đã tạo trước đó

                </h3>

                <p>

                    SPORTHUB đã cập nhật hệ thống bài tập

                    và Workout Session.

                    Kế hoạch hiện tại vẫn có thể xem,

                    nhưng bạn nên thực hiện lại Fitness Check

                    để tạo kế hoạch mới đồng bộ tốt hơn

                    với exercise ID, timer và video.

                </p>

                <a

                    class="workout-plan-cta"

                    href="/shop-the-thao-v2/health-check.html"

                >

                    Làm lại Fitness Check

                </a>

            </div>

        `;

    }

    /* =====================================================

       32. RESUME SESSION

    ====================================================== */

function buildResumeHTML() {

    if (

        !hasSavedSession()

    ) {

        return "";

    }

    return `

        <div class="workout-plan-notice resume">

            <h3>

                Bạn có một buổi tập đang dang dở

            </h3>

            <p>

                Tiến độ buổi tập trước đã được lưu

                trên trình duyệt này.

                Bạn có thể tiếp tục

                từ vị trí đã dừng.

            </p>

            <button

                type="button"

                class="workout-start-btn workout-resume-btn"

                data-workout-action="resume"

            >

                ▶ TIẾP TỤC BUỔI TẬP

            </button>

        </div>

    `;

}
    /* =====================================================

       33. EXERCISE ROW

    ====================================================== */

    function buildExerciseHTML(

        exercise,

        index

    ) {

        const media =

            getExerciseMedia(

                exercise

            );

        const meta =

            getExerciseMeta(

                exercise

            );

        const name =

            exercise

                ?.name

            ||

            "Bài tập";

        return `

            <div class="workout-plan-exercise">

                <div class="workout-plan-exercise-number">

                    ${String(

                        index + 1

                    )

                        .padStart(

                            2,

                            "0"

                        )}

                </div>

                <div class="workout-plan-exercise-info">

                    <strong>

                        ${escapeHTML(name)}

                    </strong>

                    ${

                        meta

                            ? `

                                <span>

                                    ${escapeHTML(meta)}

                                </span>

                            `

                            : ""

                    }

                    ${

                        exercise

                            ?.rpe

                            ? `

                                <span>

                                    ${escapeHTML(

                                        exercise.rpe

                                    )}

                                </span>

                            `

                            : ""

                    }

                </div>

                ${

                    media

                        ?.video

                        ? `

                            <span

                                class="workout-plan-exercise-video"

                                title="Bài tập có video hướng dẫn trong Workout Session"

                            >

                                ▶ Video

                            </span>

                        `

                        : `

<span

    class="workout-plan-exercise-video is-missing"

    title="Chưa có video tương ứng"

>

    Hướng dẫn

</span>

                        `

                }

            </div>

        `;

    }

    /* =====================================================

       34. RECOVERY DAY

    ====================================================== */

    function buildRecoveryDayHTML(

        session,

        dayIndex,

        today

    ) {

        const recommendations =

            Array.isArray(

                session

                    ?.recommendations

            )

                ? session

                    .recommendations

                    .filter(Boolean)

                : [];

        return `

            <article

                class="

                    workout-plan-day

                    is-recovery

                    ${

                        today

                            ? "is-today"

                            : ""

                    }

                "

            >

                <div class="workout-plan-day-head">

                    <div>

                        <span class="workout-plan-day-label">

                            ${escapeHTML(

                                DAY_NAMES[

                                    dayIndex

                                ]

                            )}

                            ${

                                today

                                    ? " · HÔM NAY"

                                    : ""

                            }

                        </span>

                        <h3>

                            ${escapeHTML(

                                session

                                    ?.name

                                ||

                                "Phục hồi"

                            )}

                        </h3>

                    </div>

                    <span class="workout-plan-day-type">

                        Phục hồi

                    </span>

                </div>

                <div class="workout-recovery-content">

                    <p>

                        Ngày này không có Workout Session

                        bắt buộc.

                        Ưu tiên nghỉ ngơi và vận động nhẹ

                        nếu cảm thấy phù hợp.

                    </p>

                    ${

                        recommendations.length

                            ? `

                                <ul>

                                    ${

                                        recommendations

                                            .map(

                                                item =>

                                                    `<li>${escapeHTML(item)}</li>`

                                            )

                                            .join("")

                                    }

                                </ul>

                            `

                            : ""

                    }

                </div>

            </article>

        `;

    }

    /* =====================================================

       35. TRAINING DAY

    ====================================================== */

    function buildTrainingDayHTML(

        session,

        dayIndex,

        today,

        blocked

    ) {

        const exercises =

            Array.isArray(

                session

                    ?.exercises

            )

                ? session

                    .exercises

                    .filter(Boolean)

                : [];

        const duration =

            Number(

                session

                    ?.duration

            );

        const intensity =

            session

                ?.intensity

            ||

            exercises[

                0

            ]

                ?.rpe

            ||

            "Theo kế hoạch";

        return `

            <article

                class="

                    workout-plan-day

                    ${

                        today

                            ? "is-today"

                            : ""

                    }

                "

            >

                <div class="workout-plan-day-head">

                    <div>

                        <span class="workout-plan-day-label">

                            ${escapeHTML(

                                DAY_NAMES[

                                    dayIndex

                                ]

                            )}

                            ${

                                today

                                    ? " · HÔM NAY"

                                    : ""

                            }

                        </span>

                        <h3>

                            ${escapeHTML(

                                session

                                    ?.name

                                ||

                                "Buổi tập"

                            )}

                        </h3>

                    </div>

                    <span class="workout-plan-day-type">

                        ${escapeHTML(

                            getSessionTypeName(

                                session

                                    ?.type

                            )

                        )}

                    </span>

                </div>

                <div class="workout-plan-day-info">

                    <div>

                        <span>

                            Thời lượng

                        </span>

                        <strong>

                            ${

                                Number.isFinite(

                                    duration

                                )

                                &&

                                duration > 0

                                    ? `${duration} phút`

                                    : "Theo buổi tập"

                            }

                        </strong>

                    </div>

                    <div>

                        <span>

                            Số bài

                        </span>

                        <strong>

                            ${exercises.length} bài

                        </strong>

                    </div>

                    <div>

                        <span>

                            Loại

                        </span>

                        <strong>

                            ${escapeHTML(

                                getSessionTypeName(

                                    session

                                        ?.type

                                )

                            )}

                        </strong>

                    </div>

                    <div>

                        <span>

                            Cường độ

                        </span>

                        <strong>

                            ${escapeHTML(

                                intensity

                            )}

                        </strong>

                    </div>

                </div>

                <div class="workout-plan-exercises">

                    <div class="workout-plan-exercises-title">

                        Danh sách bài tập

                    </div>

                    ${

                        exercises.length

                            ? exercises

                                .map(

                                    buildExerciseHTML

                                )

                                .join("")

                            : `

<p class="workout-plan-empty-exercises">

    Buổi tập này chưa có

    danh sách bài tập.

</p>

                            `

                    }

                </div>

                <div class="workout-plan-actions">

                    <button

                        type="button"

                        class="workout-start-btn"

                        data-workout-action="start"

                        data-day-index="${dayIndex}"

                        ${

                            blocked

                            ||

                            !exercises.length

                                ? "disabled"

                                : ""

                        }

                    >

                        ▶ BẮT ĐẦU TẬP LUYỆN

                    </button>

                </div>

            </article>

        `;

    }

    /* =====================================================

       36. DAY

    ====================================================== */

    function buildDayHTML(

        session,

        dayIndex,

        blocked

    ) {

        const today =

            getTodayIndex()

            ===

            dayIndex;

        if (

            !session

            ||

            session.type ===

            "Recovery"

        ) {

            return buildRecoveryDayHTML(

                session

                ||

                {

                    name:

                        "Phục hồi",

                    type:

                        "Recovery",

                    recommendations:

                        []

                },

                dayIndex,

                today

            );

        }

        return buildTrainingDayHTML(

            session,

            dayIndex,

            today,

            blocked

        );

    }

    /* =====================================================

       37. WEEK

    ====================================================== */

    function buildWeekHTML(

        workout,

        health

    ) {

        const week =

            normalizeWeek(

                workout

            );

        const blocked =

            isSafetyBlocked(

                health,

                workout

            );

        return `

            <section

                aria-labelledby="workoutWeekTitle"

            >

                <div class="workout-week-head">

                    <div>

                        <span class="eyebrow">

                            KẾ HOẠCH TẬP

                        </span>

                        <h2 id="workoutWeekTitle">

                            Lịch 7 ngày

                        </h2>

                    </div>

                    <p>

                        Chọn một ngày tập

                        để bắt đầu Workout Session.

                        Hôm nay được đánh dấu

                        bằng viền lime.

                    </p>

                </div>

                <div class="workout-plan-grid">

                    ${

                        week

                            .map(

                                (

                                    session,

                                    index

                                ) => {

                                    return buildDayHTML(

                                        session,

                                        index,

                                        blocked

                                    );

                                }

                            )

                            .join("")

                    }

                </div>

            </section>

        `;

    }

    /* =====================================================

       38. DYNAMIC STRATEGY

    ====================================================== */

    function buildDynamicStrategyHTML(

        workout

    ) {

        const strategy =

            workout

                ?.strategy;

        if (!strategy) {

            return "";

        }

        return `

            <section

                class="workout-strategy"

                aria-labelledby="workoutStrategyDynamicTitle"

            >

                <span class="eyebrow">

                    CHIẾN LƯỢC

                </span>

                <h2 id="workoutStrategyDynamicTitle">

                    Vì sao lịch được chia như vậy?

                </h2>

                <p>

                    ${escapeHTML(

                        strategy.reason

                        ||

                        "Kế hoạch được phân bổ theo số buổi tập và mục tiêu đã chọn."

                    )}

                </p>

                <div class="workout-strategy-grid">

                    <article class="workout-strategy-card">

                        <strong>

                            Split

                        </strong>

                        <p>

                            ${escapeHTML(

                                strategy.split

                                ||

                                "Theo kế hoạch"

                            )}

                        </p>

                    </article>

                    <article class="workout-strategy-card">

                        <strong>

                            Tăng tiến

                        </strong>

                        <p>

                            ${escapeHTML(

                                strategy.progression

                                ||

                                workout

                                    ?.rules

                                    ?.progression

                                ||

                                "Tăng độ khó từng bước nhỏ khi kỹ thuật và khả năng phục hồi phù hợp."

                            )}

                        </p>

                    </article>

                    <article class="workout-strategy-card">

                        <strong>

                            Phục hồi

                        </strong>

                        <p>

                            ${escapeHTML(

                                strategy.recoveryRule

                                ||

                                workout

                                    ?.recoveryAdjustment

                                    ?.message

                                ||

                                "Duy trì ngày phục hồi giữa các buổi khi cần."

                            )}

                        </p>

                    </article>

                    <article class="workout-strategy-card">

                        <strong>

                            Cường độ

                        </strong>

                        <p>

                            ${escapeHTML(

                                strategy.beginnerIntensity

                                ||

                                "Ưu tiên kỹ thuật và cường độ có thể kiểm soát."

                            )}

                        </p>

                    </article>

                </div>

            </section>

        `;

    }

    /* =====================================================

       39. NO PLAN

    ====================================================== */

    function renderNoPlan() {

        root.innerHTML = `

            <div class="workout-plan-state">

                <div

                    class="workout-plan-state-icon"

                    aria-hidden="true"

                >

                    🏋

                </div>

                <h2>

                    Chưa có kế hoạch tập luyện

                </h2>

                <p>

                    Hãy hoàn thành Fitness Check

                    để SPORTHUB tạo lịch tập

                    dựa trên mục tiêu,

                    kinh nghiệm,

                    số buổi,

                    dụng cụ

                    và khả năng phục hồi.

                </p>

                <a

                    class="workout-plan-cta"

                    href="/shop-the-thao-v2/health-check.html"

                >

                    Thực hiện Fitness Check

                </a>

            </div>

        `;

    }
    /* =====================================================

       40. INVALID PLAN

    ====================================================== */

    function renderInvalidPlan(

        workout

    ) {

        root.innerHTML = `

            <div class="workout-plan-state">

                <div

                    class="workout-plan-state-icon"

                    aria-hidden="true"

                >

                    ⚠

                </div>

                <h2>

                    Kế hoạch tập chưa sẵn sàng

                </h2>

                <p>

                    ${escapeHTML(

                        workout

                            ?.reason

                        ||

                        workout

                            ?.error

                        ||

                        "Không thể đọc kế hoạch tập luyện hiện tại."

                    )}

                </p>

                <a

                    class="workout-plan-cta"

                    href="/shop-the-thao-v2/health-check.html"

                >

                    Quay lại Fitness Check

                </a>

            </div>

        `;

    }

    /* =====================================================

       41. BLOCKED PLAN

    ====================================================== */

    function renderBlockedPlan(

        profile,

        health,

        workout

    ) {

        root.innerHTML = `

            ${buildSummaryHTML(

                profile,

                workout

            )}

            ${buildSafetyHTML(

                health,

                workout

            )}

            <div class="workout-plan-state">

                <div

                    class="workout-plan-state-icon"

                    aria-hidden="true"

                >

                    ⛔

                </div>

                <h2>

                    Chưa thể bắt đầu Workout Session

                </h2>

                <p>

                    ${escapeHTML(

                        workout

                            ?.reason

                        ||

                        health

                            ?.safety

                            ?.message

                        ||

                        "Safety Gate chưa cho phép tự động hóa kế hoạch tập."

                    )}

                </p>

                <a

                    class="workout-plan-cta"

                    href="/shop-the-thao-v2/health-check.html"

                >

                    Xem lại Fitness Check

                </a>

            </div>

        `;

    }

    /* =====================================================

       42. MAIN RENDER

    ====================================================== */

    function render() {

        root =

            document.getElementById(

                "workoutPlanApp"

            );

        if (!root) {

            return;

        }

        setBusy(

            true

        );

        const profile =

            getProfile();

        const health =

            getHealth();

        const workout =

            getWorkout();

        if (

            !workout

        ) {

            renderNoPlan();

            setBusy(

                false

            );

            return;

        }

        if (

            workout.success ===

            false

            &&

            workout.blocked !==

            true

        ) {

            renderInvalidPlan(

                workout

            );

            setBusy(

                false

            );

            return;

        }

        if (

            isSafetyBlocked(

                health,

                workout

            )

        ) {

            renderBlockedPlan(

                profile,

                health,

                workout

            );

            setBusy(

                false

            );

            return;

        }

        root.innerHTML = `

            ${buildSummaryHTML(

                profile,

                workout

            )}

            ${buildResumeHTML()}

            ${buildLegacyHTML(

                workout

            )}

            ${buildSafetyHTML(

                health,

                workout

            )}

            ${buildRecoveryHTML(

                workout

            )}

            ${buildWeekHTML(

                workout,

                health

            )}

            ${buildDynamicStrategyHTML(

                workout

            )}

        `;

        setBusy(

            false

        );

    }

    /* =====================================================

       43. START DAY

    ====================================================== */

function startDay(

    dayIndex

) {

    const workout =

        getWorkout();

    const health =

        getHealth();

    if (

        isSafetyBlocked(

            health,

            workout

        )

    ) {

        notify(

            "Safety Gate hiện chưa cho phép bắt đầu Workout Session."

        );

        return false;

    }

    const sessionAPI =

        window

            .SportHubWorkoutSession;

    if (!sessionAPI) {

        notify(

            "Không tìm thấy workout-session.js."

        );

        return false;

    }

    if (

        typeof sessionAPI

            .startDay

        !==

        "function"

    ) {

        notify(

            "Workout Session chưa sẵn sàng."

        );

        return false;

    }

    const index =

        Number(

            dayIndex

        );

    if (

        !Number.isInteger(

            index

        )

        ||

        index < 0

        ||

        index > 6

    ) {

        notify(

            "Ngày tập không hợp lệ."

        );

        return false;

    }

    const day =

        normalizeWeek(

            workout

        )[

            index

        ];

    if (

        !day

        ||

        day.type ===

        "Recovery"

        ||

        !Array.isArray(

            day.exercises

        )

        ||

        day.exercises.length ===

        0

    ) {

        notify(

            "Ngày này không có buổi tập để bắt đầu."

        );

        return false;

    }

    if (

        hasSavedSession()

    ) {

        const confirmed =

            window.confirm(

                "Bạn đang có một buổi tập chưa hoàn thành. Nếu bắt đầu buổi tập mới, tiến độ buổi tập cũ có thể bị thay thế. Bạn vẫn muốn bắt đầu buổi tập mới?"

            );

        if (!confirmed) {

            return false;

        }

        try {

            localStorage.removeItem(
                STORAGE.activeSession
            );

        }

        catch (error) {

            notify(
                "Không thể thay thế buổi tập đang lưu trên trình duyệt này."
            );

            return false;

        }

    }

    return sessionAPI

        .startDay(

            index

        );

}

    /* =====================================================

       44. RESUME

    ====================================================== */

function resumeSaved() {

    const sessionAPI =

        window

            .SportHubWorkoutSession;

    if (!sessionAPI) {

        notify(

            "Không tìm thấy workout-session.js."

        );

        return false;

    }

    if (

        typeof sessionAPI

            .resumeSaved

        !==

        "function"

    ) {

        notify(

            "Không thể khôi phục buổi tập đã lưu."

        );

        return false;

    }

    if (

        !hasSavedSession()

    ) {

        notify(

            "Không tìm thấy buổi tập đang dang dở."

        );

        render();

        return false;

    }

    const success =

        sessionAPI

            .resumeSaved();

    if (!success) {

        /*
            workout-session.js đã tự thông báo
            lý do Resume thất bại, ví dụ Safety Gate.

            Không hiển thị thêm thông báo
            "Không tìm thấy buổi tập" sai ngữ cảnh.
        */

        render();

    }

    return success;

}

    /* =====================================================

       45. CLICK HANDLER

    ====================================================== */

    function handleClick(

        event

    ) {

        const button =

            event.target

                .closest(

                    "[data-workout-action]"

                );

        if (

            !button

            ||

            !root

                ?.contains(

                    button

                )

        ) {

            return;

        }

        const action =

            button

                .dataset

                .workoutAction;

        if (

            action ===

            "start"

        ) {

            startDay(

                Number(

                    button

                        .dataset

                        .dayIndex

                )

            );

            return;

        }

        if (

            action ===

            "resume"

        ) {

            resumeSaved();

        }

    }

    /* =====================================================

       46. SESSION EVENTS

    ====================================================== */

function bindSessionEvents() {

    if (

        eventsBound

    ) {

        return;

    }

    eventsBound =

        true;

    window.addEventListener(

        "sporthub:workout-complete",

        render

    );

    window.addEventListener(

        "sporthub:workout-stop",

        render

    );

    window.addEventListener(

        "sporthub:personal-plan-update",

        render

    );

    window.addEventListener(

        "storage",

        event => {

            const watchedKeys = [

                STORAGE.profile,

                STORAGE.health,

                STORAGE.workout,

                STORAGE.activeSession

            ];

            if (

                event.key

                &&

                watchedKeys.includes(

                    event.key

                )

            ) {

                render();

            }

        }

    );

}

    /* =====================================================

       47. INIT

    ====================================================== */

    function init() {

        root =

            document.getElementById(

                "workoutPlanApp"

            );

        if (!root) {

            return;

        }

        root.addEventListener(

            "click",

            handleClick

        );

        bindSessionEvents();

        render();

    }

    /* =====================================================

       48. DOM READY

    ====================================================== */

    if (

        document.readyState ===

        "loading"

    ) {

        document.addEventListener(

            "DOMContentLoaded",

            init,

            {

                once:

                    true

            }

        );

    }

    else {

        init();

    }

    /* =====================================================

       49. PUBLIC API

    ====================================================== */

    return {

        version:
            "1.3",

        render:

            render,

        startDay:

            startDay,

        resumeSaved:

            resumeSaved,

        getWorkout:

            getWorkout,

        getHealth:

            getHealth,

        getProfile:

            getProfile,

        getExerciseMedia:

            getExerciseMedia

    };

})();