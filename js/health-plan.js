/* =========================================================
   SPORTHUB HEALTH PLAN PAGE
   Version 1.0

   Dùng cho:
   ke-hoach-suc-khoe.html

   Nhiệm vụ:
   - Đọc dữ liệu Fitness Check đã lưu
   - Hiển thị Safety Check
   - Hiển thị BMI
   - Hiển thị RMR
   - Hiển thị Activity Factor
   - Hiển thị TDEE
   - Hiển thị mục tiêu calorie
   - Hiển thị protein / fat / carb
   - Hiển thị phục hồi

   Không chạy lại Health Engine.
========================================================= */

window.SportHubHealthPlanPage = (() => {

    "use strict";


    /* =====================================================
       1. STORAGE
    ====================================================== */

    const STORAGE = {

        profile:
            "sporthub_fitness_profile",

        health:
            "sporthub_fitness_analysis"

    };


    /* =====================================================
       2. ROOT
    ====================================================== */

    let root =
        null;


    /* =====================================================
       3. SAFE JSON
    ====================================================== */

    function safeParse(
        value
    ) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

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
       4. ESCAPE HTML
    ====================================================== */

    function escapeHTML(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(
            value
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
       5. HELPERS
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


    function cleanText(
        value
    ) {

        return String(
            value ?? ""
        ).trim();

    }


    function hasValue(
        value
    ) {

        return !(
            value === null ||
            value === undefined ||
            value === ""
        );

    }


    function displayValue(
        value,
        fallback = "—"
    ) {

        return hasValue(
            value
        )
            ? escapeHTML(
                value
            )
            : fallback;

    }


    function displayRange(
        data,
        unit = ""
    ) {

        if (!data) {

            return "—";

        }


        if (
            hasValue(
                data.min
            )
            &&
            hasValue(
                data.max
            )
        ) {

            return `
                ${escapeHTML(data.min)}
                –
                ${escapeHTML(data.max)}
                ${escapeHTML(unit)}
            `;

        }


        if (
            hasValue(
                data.value
            )
        ) {

            return `
                ${escapeHTML(data.value)}
                ${escapeHTML(unit)}
            `;

        }


        return "—";

    }


    /* =====================================================
       6. DATA
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


    /* =====================================================
       7. GOAL NAME
    ====================================================== */

    function getGoalName(
        goal
    ) {

        if (
            window
                .SportHubPersonalPlan
                ?.getGoalName
        ) {

            return window
                .SportHubPersonalPlan
                .getGoalName(
                    goal
                );

        }


        const names = {

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


        return names[
            goal
        ]
        ||
        "Chưa xác định";

    }


    /* =====================================================
       8. EMPTY STATE
    ====================================================== */

    function renderEmpty() {

        if (!root) {

            return;

        }


        root.innerHTML = `

            <div class="health-plan-state">

                <span class="eyebrow">
                    CHƯA CÓ DỮ LIỆU
                </span>

                <h2>
                    Chưa có kế hoạch sức khỏe
                </h2>

                <p>
                    Hãy hoàn thành Fitness Check trước.
                    SPORTHUB sẽ phân tích dữ liệu và lưu
                    kết quả trên thiết bị này để hiển thị
                    kế hoạch sức khỏe cá nhân.
                </p>

                <a
                    class="health-plan-cta"
                    href="health-check.html"
                >
                    Thực hiện Fitness Check
                </a>

            </div>

        `;

    }


    /* =====================================================
       9. INVALID STATE
    ====================================================== */

    function renderInvalid(
        health
    ) {

        if (!root) {

            return;

        }


        root.innerHTML = `

            <div class="health-plan-state">

                <span class="eyebrow">
                    DỮ LIỆU CHƯA SẴN SÀNG
                </span>

                <h2>
                    Chưa thể hiển thị kết quả
                </h2>

                <p>
                    ${
                        escapeHTML(
                            health
                                ?.error
                            ||
                            "Kết quả Fitness Check hiện chưa hợp lệ."
                        )
                    }
                </p>

                <a
                    class="health-plan-cta"
                    href="health-check.html"
                >
                    Tạo lại Fitness Check
                </a>

            </div>

        `;

    }


    /* =====================================================
       10. PROFILE SUMMARY
    ====================================================== */

    function buildProfileSummaryHTML(
        profile
    ) {

        const goal =
            profile
                ?.goal
                ?.primary;


        return `

            <section class="health-plan-summary">

                <div class="health-plan-summary-head">

                    <span class="eyebrow">
                        TỔNG QUAN
                    </span>

                    <h2>
                        Hồ sơ thể trạng
                    </h2>

                </div>


                <div class="health-plan-stat-grid">


                    <div class="health-plan-stat">

                        <span>
                            Tuổi
                        </span>

                        <strong>
                            ${
                                displayValue(
                                    profile
                                        ?.age
                                )
                            }
                        </strong>

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            Chiều cao
                        </span>

                        <strong>
                            ${
                                hasValue(
                                    profile
                                        ?.height
                                )

                                    ? `
                                        ${escapeHTML(profile.height)}
                                        cm
                                    `

                                    : "—"
                            }
                        </strong>

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            Cân nặng
                        </span>

                        <strong>
                            ${
                                hasValue(
                                    profile
                                        ?.weight
                                )

                                    ? `
                                        ${escapeHTML(profile.weight)}
                                        kg
                                    `

                                    : "—"
                            }
                        </strong>

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            Mục tiêu
                        </span>

                        <strong>
                            ${
                                escapeHTML(
                                    getGoalName(
                                        goal
                                    )
                                )
                            }
                        </strong>

                    </div>


                </div>

            </section>

        `;

    }


    /* =====================================================
       11. SAFETY
    ====================================================== */

    function buildSafetyHTML(
        health
    ) {

        const safety =
            health
                ?.safety;


        if (!safety) {

            return "";

        }


        const reasons =
            Array.isArray(
                safety.reasons
            )
                ? safety.reasons
                : [];


        if (
            safety.level ===
            "stop"
        ) {

            return `

                <section class="health-plan-notice stop">

                    <h2>
                        Safety Check cần chú ý
                    </h2>

                    ${
                        reasons.length

                            ? `
                                <ul>
                                    ${
                                        reasons
                                            .map(
                                                item => `
                                                    <li>
                                                        ${escapeHTML(item)}
                                                    </li>
                                                `
                                            )
                                            .join("")
                                    }
                                </ul>
                            `

                            : ""
                    }

                    ${
                        cleanText(
                            safety.message
                        )

                            ? `
                                <p>
                                    ${escapeHTML(safety.message)}
                                </p>
                            `

                            : ""
                    }

                </section>

            `;

        }


        if (
            safety.level ===
            "caution"
        ) {

            return `

                <section class="health-plan-notice caution">

                    <h2>
                        Có yếu tố cần điều chỉnh
                    </h2>

                    ${
                        cleanText(
                            safety.message
                        )

                            ? `
                                <p>
                                    ${escapeHTML(safety.message)}
                                </p>
                            `

                            : `
                                <p>
                                    Kết quả Fitness Check ghi nhận
                                    một số yếu tố cần được xem xét
                                    khi áp dụng kế hoạch.
                                </p>
                            `
                    }

                </section>

            `;

        }


        return `

            <section class="health-plan-notice safe">

                <h2>
                    Safety Check ban đầu
                </h2>

                <p>
                    ${
                        escapeHTML(
                            safety.message
                            ||
                            "Chưa ghi nhận yếu tố cảnh báo chính trong các câu hỏi đã cung cấp."
                        )
                    }
                </p>

            </section>

        `;

    }


    /* =====================================================
       12. BODY
    ====================================================== */

    function buildBodyHTML(
        health
    ) {

        const body =
            health
                ?.body
                || {};


        const bmi =
            body.bmi
            || null;


        const rmr =
            body.rmr
            || null;


        return `

            <section class="health-plan-section">

                <span class="eyebrow">
                    THỂ TRẠNG
                </span>

                <h2>
                    Các chỉ số nền tảng
                </h2>


                <div class="health-plan-stat-grid">


                    <div class="health-plan-stat">

                        <span>
                            BMI
                        </span>

                        <strong>
                            ${
                                bmi
                                    ? displayValue(
                                        bmi.value
                                    )
                                    : "—"
                            }
                        </strong>

                        ${
                            bmi
                            &&
                            cleanText(
                                bmi.category
                            )

                                ? `
                                    <small>
                                        ${escapeHTML(bmi.category)}
                                    </small>
                                `

                                : ""
                        }

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            RMR ước tính
                        </span>

                        <strong>
                            ${
                                rmr
                                &&
                                hasValue(
                                    rmr.value
                                )

                                    ? `
                                        ${escapeHTML(rmr.value)}
                                        kcal
                                    `

                                    : "—"
                            }
                        </strong>

                        <small>
                            Năng lượng cơ thể ước tính sử dụng
                            khi nghỉ ngơi.
                        </small>

                    </div>


                </div>


                ${
                    bmi
                    &&
                    cleanText(
                        bmi.note
                    )

                        ? `
                            <p style="margin-top:18px">
                                <strong>
                                    BMI:
                                </strong>

                                ${escapeHTML(bmi.note)}
                            </p>
                        `

                        : ""
                }


                ${
                    rmr
                    &&
                    cleanText(
                        rmr.note
                    )

                        ? `
                            <p>
                                <strong>
                                    RMR:
                                </strong>

                                ${escapeHTML(rmr.note)}
                            </p>
                        `

                        : ""
                }


            </section>

        `;

    }


    /* =====================================================
       13. ENERGY
    ====================================================== */

    function buildEnergyHTML(
        health
    ) {

        const energy =
            health
                ?.energy
                || {};


        const factor =
            energy.activityFactor
            || null;


        const tdee =
            energy.tdee
            || null;


        const calorie =
            energy.calorieTarget
            || null;


        return `

            <section class="health-plan-section">

                <span class="eyebrow">
                    NĂNG LƯỢNG
                </span>

                <h2>
                    Nhu cầu năng lượng ước tính
                </h2>


                <div class="health-plan-stat-grid">


                    <div class="health-plan-stat">

                        <span>
                            Hệ số vận động
                        </span>

                        <strong>
                            ${
                                factor
                                    ? displayValue(
                                        factor.value
                                    )
                                    : "—"
                            }
                        </strong>

                        ${
                            factor
                            &&
                            cleanText(
                                factor.label
                            )

                                ? `
                                    <small>
                                        ${escapeHTML(factor.label)}
                                    </small>
                                `

                                : ""
                        }

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            TDEE
                        </span>

                        <strong>
                            ${
                                displayRange(
                                    tdee,
                                    "kcal"
                                )
                            }
                        </strong>

                        <small>
                            Tổng năng lượng tiêu hao
                            ước tính mỗi ngày.
                        </small>

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            Calorie mục tiêu
                        </span>

                        <strong>
                            ${
                                displayRange(
                                    calorie,
                                    "kcal/ngày"
                                )
                            }
                        </strong>

                    </div>


                </div>


                ${
                    calorie
                    &&
                    cleanText(
                        calorie.strategy
                    )

                        ? `
                            <p style="margin-top:18px">

                                <strong>
                                    Chiến lược:
                                </strong>

                                ${escapeHTML(calorie.strategy)}

                            </p>
                        `

                        : ""
                }


                ${
                    calorie
                    &&
                    cleanText(
                        calorie.note
                    )

                        ? `
                            <p>
                                ${escapeHTML(calorie.note)}
                            </p>
                        `

                        : ""
                }


                ${
                    tdee
                    &&
                    cleanText(
                        tdee.note
                    )

                        ? `
                            <p>
                                ${escapeHTML(tdee.note)}
                            </p>
                        `

                        : ""
                }


            </section>

        `;

    }


    /* =====================================================
       14. MACROS
    ====================================================== */

    function buildNutritionHTML(
        health
    ) {

        const nutrition =
            health
                ?.nutrition
                || {};


        const protein =
            nutrition.protein
            || null;


        const fat =
            nutrition.fat
            || null;


        const carbs =
            nutrition.carbs
            || null;


        return `

            <section class="health-plan-section">

                <span class="eyebrow">
                    DINH DƯỠNG
                </span>

                <h2>
                    Mục tiêu macro khởi đầu
                </h2>


                <div class="health-plan-stat-grid">


                    <div class="health-plan-stat">

                        <span>
                            Protein
                        </span>

                        <strong>
                            ${
                                displayRange(
                                    protein,
                                    "g/ngày"
                                )
                            }
                        </strong>

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            Chất béo
                        </span>

                        <strong>
                            ${
                                displayRange(
                                    fat,
                                    "g/ngày"
                                )
                            }
                        </strong>

                    </div>


                    <div class="health-plan-stat">

                        <span>
                            Carbohydrate
                        </span>

                        <strong>
                            ${
                                carbs
                                &&
                                hasValue(
                                    carbs.value
                                )

                                    ? `
                                        ${escapeHTML(carbs.value)}
                                        g/ngày
                                    `

                                    : displayRange(
                                        carbs,
                                        "g/ngày"
                                    )
                            }
                        </strong>

                    </div>


                </div>


                <p style="margin-top:18px">
                    Các mức trên là điểm khởi đầu được tạo
                    từ kết quả Fitness Check. Xem trang
                    Kế hoạch dinh dưỡng để theo dõi
                    thực đơn chi tiết.
                </p>

            </section>

        `;

    }


    /* =====================================================
       15. RECOVERY
    ====================================================== */

    function buildRecoveryHTML(
        health,
        profile
    ) {

        const recovery =
            health
                ?.recovery
                || {};


        const profileRecovery =
            profile
                ?.recovery
                || {};


        const sleepHours =

            hasValue(
                recovery.sleepHours
            )

                ? recovery.sleepHours

                : profileRecovery.sleepHours;


        const energy =

            hasValue(
                recovery.energy
            )

                ? recovery.energy

                : profileRecovery.energy;


        const stress =

            hasValue(
                recovery.stress
            )

                ? recovery.stress

                : profileRecovery.stress;


        const fatigue =

            hasValue(
                recovery.fatigue
            )

                ? recovery.fatigue

                : profileRecovery.fatigue;


        return `

            <section class="health-plan-section">

                <span class="eyebrow">
                    PHỤC HỒI
                </span>

                <h2>
                    Giấc ngủ & mức sẵn sàng
                </h2>


                <div class="health-recovery-grid">


                    <div class="health-recovery-card">

                        <span>
                            Giấc ngủ
                        </span>

                        <strong>
                            ${
                                hasValue(
                                    sleepHours
                                )

                                    ? `
                                        ${escapeHTML(sleepHours)}
                                        giờ
                                    `

                                    : "—"
                            }
                        </strong>

                    </div>


                    <div class="health-recovery-card">

                        <span>
                            Năng lượng
                        </span>

                        <strong>
                            ${
                                hasValue(
                                    energy
                                )

                                    ? `
                                        ${escapeHTML(energy)}
                                        /10
                                    `

                                    : "—"
                            }
                        </strong>

                    </div>


                    <div class="health-recovery-card">

                        <span>
                            Stress
                        </span>

                        <strong>
                            ${
                                hasValue(
                                    stress
                                )

                                    ? `
                                        ${escapeHTML(stress)}
                                        /10
                                    `

                                    : "—"
                            }
                        </strong>

                    </div>


                    <div class="health-recovery-card">

                        <span>
                            Mức mệt
                        </span>

                        <strong>
                            ${
                                hasValue(
                                    fatigue
                                )

                                    ? `
                                        ${escapeHTML(fatigue)}
                                        /10
                                    `

                                    : "—"
                            }
                        </strong>

                    </div>


                </div>


                ${
                    cleanText(
                        recovery.sleepAction
                    )

                        ? `
                            <p style="margin-top:18px">

                                <strong>
                                    Ưu tiên phục hồi:
                                </strong>

                                ${escapeHTML(recovery.sleepAction)}

                            </p>
                        `

                        : ""
                }


                ${
                    cleanText(
                        recovery.message
                    )

                        ? `
                            <p>
                                ${escapeHTML(recovery.message)}
                            </p>
                        `

                        : ""
                }


            </section>

        `;

    }


    /* =====================================================
       16. STATUS
    ====================================================== */

    function buildStatusHTML(
        health
    ) {

        const safety =
            health
                ?.safety;


        const automationAllowed =
            safety
                ?.allowFullAutomation
            !== false;


        return `

            <section
                class="
                    health-plan-notice
                    ${
                        automationAllowed
                            ? "safe"
                            : "stop"
                    }
                "
            >

                <h2>
                    Trạng thái kế hoạch
                </h2>

                ${
                    automationAllowed

                        ? `
                            <p>
                                Dữ liệu Fitness Check hiện đã sẵn sàng
                                để các trang tập luyện và dinh dưỡng
                                sử dụng kế hoạch đã được tạo.
                            </p>
                        `

                        : `
                            <p>
                                Safety Gate hiện giới hạn việc tự động
                                áp dụng kế hoạch chuyên sâu. Hãy xem lại
                                thông báo Safety Check trước khi tiếp tục.
                            </p>
                        `
                }

            </section>

        `;

    }


    /* =====================================================
       17. MAIN RENDER
    ====================================================== */

    function render() {

        root =
            document.getElementById(
                "healthPlanApp"
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


        if (
            !profile ||
            !health
        ) {

            renderEmpty();

            setBusy(
                false
            );

            return;

        }


        if (
            health.success !==
            true
        ) {

            renderInvalid(
                health
            );

            setBusy(
                false
            );

            return;

        }


        root.innerHTML = `

            ${
                buildProfileSummaryHTML(
                    profile
                )
            }

            ${
                buildSafetyHTML(
                    health
                )
            }

            ${
                buildBodyHTML(
                    health
                )
            }

            ${
                buildEnergyHTML(
                    health
                )
            }

            ${
                buildNutritionHTML(
                    health
                )
            }

            ${
                buildRecoveryHTML(
                    health,
                    profile
                )
            }

            ${
                buildStatusHTML(
                    health
                )
            }

        `;


        setBusy(
            false
        );

    }


    /* =====================================================
       18. INIT
    ====================================================== */

    function init() {

        render();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else {

        init();

    }


    /* =====================================================
       19. STORAGE UPDATE

       Nếu Fitness Check được chạy ở tab khác,
       trang có thể render lại dữ liệu mới.
    ====================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                    STORAGE.profile
                ||
                event.key ===
                    STORAGE.health
            ) {

                render();

            }

        }
    );


    window.addEventListener(
        "sporthub:personal-plan-update",
        () => {

            render();

        }
    );


    /* =====================================================
       20. PUBLIC API
    ====================================================== */

    return {

        version:
            "1.0",

        render,

        refresh:
            render,

        getProfile,

        getHealth

    };

})();