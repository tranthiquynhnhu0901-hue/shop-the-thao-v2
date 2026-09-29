/* =========================================================
   SPORTHUB WORKOUT SESSION
   Version 1.2

   Video + Set + Reps + Timer + Rest
   Pause + Resume + Next + Stop

   UI/CSS:
   - css/personal-plan.css

   Dữ liệu sử dụng:
   - sporthub_workout_plan
   - sporthub_fitness_analysis
   - sporthub_workout_active_session
   - sporthub_workout_history
========================================================= */

window.SportHubWorkoutSession = (() => {
    "use strict";

    const STORAGE = {
        workoutPlan: "sporthub_workout_plan",
        health: "sporthub_fitness_analysis",
        active: "sporthub_workout_active_session",
        history: "sporthub_workout_history"
    };

    const DAY_NAMES = [
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
        "Chủ Nhật"
    ];

    /*
       Registry dự phòng để giữ tương thích với plan cũ.
       exercise-media.js vẫn được ưu tiên trước registry này.
    */
    const MEDIA = {
        "bodyweight-squat":
            "images/exercises/ex01-bodyweight-squat.mp4",

        "forward-lunge":
            "images/exercises/ex02-forward-lunge.mp4",

        "reverse-lunge":
            "images/exercises/ex03-reverse-lunge.mp4",

        "glute-bridge":
            "images/exercises/ex04-glute-bridge.mp4",

        "push-up":
            "images/exercises/ex05-push-up.mp4",

        "knee-push-up":
            "images/exercises/ex06-knee-push-up.mp4",

        "dumbbell-shoulder-press":
            "images/exercises/ex07-dumbbell-shoulder-press.mp4",

        "dumbbell-bent-over-row":
            "images/exercises/ex08-dumbbell-bent-over-row.mp4",

        "dumbbell-biceps-curl":
            "images/exercises/ex09-dumbbell-biceps-curl.mp4",

        "plank":
            "images/exercises/ex10-plank.mp4",

        "side-plank":
            "images/exercises/ex11-side-plank.mp4",

        "dead-bug":
            "images/exercises/ex12-dead-bug.mp4",

        "bird-dog":
            "images/exercises/ex13-bird-dog.mp4",

        "mountain-climber":
            "images/exercises/ex14-mountain-climber.mp4",

        "jumping-jack":
            "images/exercises/ex15-jumping-jack.mp4",

        "high-knees":
            "images/exercises/ex16-high-knees.mp4",

        "jump-rope":
            "images/exercises/ex17-jump-rope.mp4",

        "burpee":
            "images/exercises/ex18-burpee.mp4",

        "cat-cow":
            "images/exercises/ex19-cat-cow.mp4",

        "full-body-mobility":
            "images/exercises/ex20-full-body-mobility.mp4"
    };

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

    let session =
        null;

    let root =
        null;

    let timerId =
        null;

    let audioContext =
        null;

    let state =
        createInitialState();


    /* =====================================================
       1. INITIAL STATE
    ====================================================== */

    function createInitialState() {

        return {

            status:
                "idle",

            phase:
                "idle",

            exerciseIndex:
                0,

            currentSet:
                1,

            pendingAction:
                null,

            pendingSet:
                null,

            remainingSeconds:
                0,

            phaseEndsAt:
                null,

            isPaused:
                false,

            pausedAt:
                null,

            totalPausedMs:
                0,

            startedAt:
                null,

            endedAt:
                null,

            completedSets:
                0,

            completedExercises:
                0,

            skippedExercises:
                0,

            dayIndex:
                null,

            sessionName:
                "",

            sessionType:
                ""

        };

    }


    /* =====================================================
       2. STORAGE HELPERS
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


    function read(
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


    function write(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(
                    value
                )
            );


            return true;

        }

        catch (error) {

            return false;

        }

    }


    function remove(
        key
    ) {

        try {

            localStorage.removeItem(
                key
            );

        }

        catch (error) {

            /*
                Không để localStorage
                làm gián đoạn workout session.
            */

        }

    }


    /* =====================================================
       3. TEXT HELPERS
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


    function clamp(
        value,
        min,
        max
    ) {

        return Math.min(

            Math.max(
                value,
                min
            ),

            max

        );

    }


    /* =====================================================
       4. TIME FORMAT
    ====================================================== */

    function formatTime(
        totalSeconds
    ) {

        const seconds =
            Math.max(

                0,

                Math.round(
                    Number(
                        totalSeconds
                    )
                    ||
                    0
                )

            );


        const hours =
            Math.floor(
                seconds / 3600
            );


        const minutes =
            Math.floor(
                (seconds % 3600) / 60
            );


        const remain =
            seconds % 60;


        if (
            hours > 0
        ) {

            return (

                `${String(hours)
                    .padStart(
                        2,
                        "0"
                    )}:`

                +

                `${String(minutes)
                    .padStart(
                        2,
                        "0"
                    )}:`

                +

                `${String(remain)
                    .padStart(
                        2,
                        "0"
                    )}`

            );

        }


        return (

            `${String(minutes)
                .padStart(
                    2,
                    "0"
                )}:`

            +

            `${String(remain)
                .padStart(
                    2,
                    "0"
                )}`

        );

    }


    /* =====================================================
       5. MESSAGE
    ====================================================== */

    function message(
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
       6. EVENTS
    ====================================================== */

    function emit(
        name,
        detail = {}
    ) {

        window.dispatchEvent(

            new CustomEvent(

                name,

                {

                    detail: {

                        state:
                            getState(),

                        session:
                            session,

                        ...detail

                    }

                }

            )

        );

    }


    /* =====================================================
       7. STORED PLAN / HEALTH
    ====================================================== */

    function getStoredPlan() {

        return read(
            STORAGE.workoutPlan
        );

    }


    function getStoredHealth() {

        return read(
            STORAGE.health
        );

    }


function isSafetyBlocked() {

    const health =
        getStoredHealth();


    const workout =
        getStoredPlan();


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

    )

    ||

    (

        workout

            ?.success

        ===

        false

    );

}

    


    /* =====================================================
       8. AVAILABLE DAYS
    ====================================================== */

    function listAvailableDays() {

        const workout =
            getStoredPlan();


        const schedule =
            Array.isArray(
                workout?.schedule
            )

                ? workout.schedule

                : [];


        return DAY_NAMES.map(

            (
                dayName,
                dayIndex
            ) => {


                const item =
                    schedule[
                        dayIndex
                    ]

                    ||

                    null;


                return {

                    dayIndex:
                        dayIndex,

                    dayName:
                        dayName,

                    sessionName:

                        item?.name

                        ||

                        item?.type

                        ||

                        "Không có lịch",

                    type:
                        item?.type
                        ||
                        "",

                    hasWorkout:
                        Boolean(

                            item

                            &&

                            item.type !==
                            "Recovery"

                            &&

                            Array.isArray(
                                item.exercises
                            )

                            &&

                            item.exercises.length

                        )

                };

            }

        );

    }


    function todayIndex() {

        return (

            new Date().getDay()

            +

            6

        ) % 7;

    }


    /* =====================================================
       9. EXERCISE VALUES
    ====================================================== */

    function setsOf(
        exercise
    ) {

        const number =
            Number.parseInt(
                exercise?.sets,
                10
            );


        return (

            Number.isFinite(
                number
            )

            &&

            number > 0

        )

            ? number

            : 1;

    }


    function numbersFrom(
        value
    ) {

        const matches =
            String(
                value || ""
            )

                .match(
                    /\d+(?:[.,]\d+)?/g
                )

            ||

            [];


        return matches

            .map(

                item =>

                    Number(

                        item.replace(
                            ",",
                            "."
                        )

                    )

            )

            .filter(
                Number.isFinite
            );

    }


    function toSeconds(
        value,
        mode = "max"
    ) {

        const text =
            String(
                value || ""
            )

                .toLowerCase();


        if (
            !text

            ||

            text.includes(
                "không áp dụng"
            )
        ) {

            return 0;

        }


        const values =
            numbersFrom(
                text
            );


        if (
            !values.length
        ) {

            return 0;

        }


        const base =
            mode ===
            "min"

                ? Math.min(
                    ...values
                )

                : Math.max(
                    ...values
                );


        const isMinutes =

            text.includes(
                "phút"
            )

            ||

            text.includes(
                "phut"
            )

            ||

            text.includes(
                "minute"
            );


        return Math.round(

            isMinutes

                ? base * 60

                : base

        );

    }


    function restSecondsOf(
        exercise
    ) {

        const explicit =
            Number(
                exercise?.restSeconds
            );


        if (

            Number.isFinite(
                explicit
            )

            &&

            explicit >= 0

        ) {

            return Math.round(
                explicit
            );

        }


        return toSeconds(
            exercise?.rest,
            "max"
        );

    }


    function durationSecondsOf(
        exercise
    ) {

        const explicit =
            Number(
                exercise?.durationSeconds
            );


        if (

            Number.isFinite(
                explicit
            )

            &&

            explicit > 0

        ) {

            return Math.round(
                explicit
            );

        }


        const text =
            String(
                exercise?.reps || ""
            )

                .toLowerCase();


        const timeBased = [

            "giây",
            "giay",
            "phút",
            "phut",
            "second",
            "minute"

        ]

            .some(

                unit =>

                    text.includes(
                        unit
                    )

            );


        if (
            !timeBased
        ) {

            return 0;

        }


        /*
            Ví dụ:
            "20–45 giây"

            Session dùng đầu dưới
            làm timer mặc định.

            Nếu engine có durationSeconds
            thì durationSeconds luôn được ưu tiên.
        */

        return toSeconds(
            exercise?.reps,
            "min"
        );

    }


    function isTimed(
        exercise
    ) {

        return (

            durationSecondsOf(
                exercise
            )

            >

            0

        );

    }


    /* =====================================================
       10. MEDIA
    ====================================================== */

    function normalizeMediaEntry(
        value
    ) {

        if (!value) {

            return null;

        }


        if (
            typeof value ===
            "string"
        ) {

            return value;

        }


        if (

            typeof value ===
            "object"

            &&

            value.video

        ) {

            return value.video;

        }


        return null;

    }


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


        if (
            direct
        ) {

            return direct;

        }


        const matchedKey =
            Object.keys(
                library
            )

                .find(

                    item =>

                        normalizeMediaKey(
                            item
                        )

                        ===

                        key

                );


        return matchedKey

            ? normalizeMediaEntry(
                library[
                    matchedKey
                ]
            )

            : null;

    }


    function mediaFor(
        exercise
    ) {

        if (!exercise) {

            return null;

        }


        /*
            Nếu plan đã có video riêng
            thì luôn ưu tiên video đó.
        */

        if (
            exercise.video
        ) {

            return exercise.video;

        }


        /*
            exercise-media.js là nguồn chính.
        */

        const external =
            window
                .SportHubExerciseMedia

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

            const externalMedia =
                findMediaInLibrary(
                    external,
                    key
                );


            if (
                externalMedia
            ) {

                return externalMedia;

            }


            /*
                MEDIA nội bộ chỉ là fallback
                tương thích plan cũ.
            */

            if (
                MEDIA[
                    key
                ]
            ) {

                return MEDIA[
                    key
                ];

            }

        }


        return null;

    }


    /* =====================================================
       11. CURRENT SESSION
    ====================================================== */

    function exercises() {

        return Array.isArray(
            session?.exercises
        )

            ? session.exercises
                .filter(
                    Boolean
                )

            : [];

    }


    function currentExercise() {

        return (

            exercises()[

                state.exerciseIndex

            ]

            ||

            null

        );

    }


    function nextExerciseData() {

        return (

            exercises()[

                state.exerciseIndex

                +

                1

            ]

            ||

            null

        );

    }


    function totalSets() {

        return exercises()

            .reduce(

                (
                    sum,
                    exercise
                ) =>

                    sum

                    +

                    setsOf(
                        exercise
                    ),

                0

            );

    }


    function progressPercent() {

        const total =
            totalSets();


        if (
            !total
        ) {

            return 0;

        }


        return clamp(

            (

                state.completedSets

                /

                total

            )

            *

            100,

            0,

            100

        );

    }


    /* =====================================================
       12. ELAPSED TIME
    ====================================================== */

    function elapsedSeconds() {

        if (
            !state.startedAt
        ) {

            return 0;

        }


        const end =
            state.endedAt

            ||

            Date.now();


        let paused =
            state.totalPausedMs

            ||

            0;


        if (

            state.isPaused

            &&

            state.pausedAt

        ) {

            paused +=

                Date.now()

                -

                state.pausedAt;

        }


        return Math.max(

            0,

            Math.floor(

                (

                    end

                    -

                    state.startedAt

                    -

                    paused

                )

                /

                1000

            )

        );

    }


    function commitPausedDuration() {

        if (

            !state.isPaused

            ||

            !state.pausedAt

        ) {

            return;

        }


        state.totalPausedMs +=

            Math.max(

                0,

                Date.now()

                -

                state.pausedAt

            );


        state.pausedAt =
            null;

    }


    /* =====================================================
       13. AUDIO / VIBRATION
    ====================================================== */

    function prepareAudio() {

        try {

            const AudioContextClass =

                window.AudioContext

                ||

                window.webkitAudioContext;


            if (
                !AudioContextClass
            ) {

                return;

            }


            if (
                !audioContext
            ) {

                audioContext =
                    new AudioContextClass();

            }


            if (

                audioContext.state ===
                "suspended"

            ) {

                audioContext.resume();

            }

        }

        catch (error) {

            /*
                Audio chỉ là enhancement.
            */

        }

    }


    function beep() {

        try {

            if (
                audioContext
            ) {

                const oscillator =
                    audioContext
                        .createOscillator();


                const gain =
                    audioContext
                        .createGain();


                oscillator.type =
                    "sine";


                oscillator.frequency.value =
                    880;


                gain.gain
                    .setValueAtTime(

                        0.0001,

                        audioContext.currentTime

                    );


                gain.gain
                    .exponentialRampToValueAtTime(

                        0.18,

                        audioContext.currentTime
                        +
                        0.01

                    );


                gain.gain
                    .exponentialRampToValueAtTime(

                        0.0001,

                        audioContext.currentTime
                        +
                        0.22

                    );


                oscillator.connect(
                    gain
                );


                gain.connect(
                    audioContext.destination
                );


                oscillator.start();


                oscillator.stop(

                    audioContext.currentTime

                    +

                    0.24

                );

            }


            if (
                navigator.vibrate
            ) {

                navigator.vibrate(
                    120
                );

            }

        }

        catch (error) {

            /*
                Không ảnh hưởng session.
            */

        }

    }


    /* =====================================================
       14. TIMER
    ====================================================== */

    function clearTimer() {

        if (
            !timerId
        ) {

            return;

        }


        clearInterval(
            timerId
        );


        timerId =
            null;

    }


    function calculateRemaining() {

        if (
            !state.phaseEndsAt
        ) {

            return (

                state.remainingSeconds

                ||

                0

            );

        }


        return Math.max(

            0,

            Math.ceil(

                (

                    state.phaseEndsAt

                    -

                    Date.now()

                )

                /

                1000

            )

        );

    }


    function setCountdown(
        seconds
    ) {

        state.remainingSeconds =

            Math.max(

                0,

                Math.round(

                    Number(
                        seconds
                    )

                    ||

                    0

                )

            );


        state.phaseEndsAt =

            Date.now()

            +

            state.remainingSeconds

            *

            1000;


        state.isPaused =
            false;


        state.pausedAt =
            null;


        startTimer();

    }


    function startTimer() {

        clearTimer();


        timerId =
            setInterval(

                tick,

                250

            );


        tick();

    }


    function tick() {

        if (

            state.status !==
            "active"

            ||

            state.isPaused

        ) {

            return;

        }


        const exercise =
            currentExercise();


        const timedExercise =

            state.phase ===
            "exercise"

            &&

            isTimed(
                exercise
            );


        const resting =

            state.phase ===
            "rest";


        if (

            !timedExercise

            &&

            !resting

        ) {

            updateDynamicUI();


            return;

        }


        state.remainingSeconds =
            calculateRemaining();


        updateDynamicUI();


        if (
            state.remainingSeconds > 0
        ) {

            return;

        }


        clearTimer();


        beep();


        if (
            resting
        ) {

            finishRest();

        }

        else {

            completeSet(
                true
            );

        }

    }


    /* =====================================================
       15. SAVE ACTIVE SESSION
    ====================================================== */

    function saveActive() {

        if (

            !session

            ||

            state.status !==
            "active"

        ) {

            return;

        }


        const exercise =
            currentExercise();


        if (

            state.phase ===
            "rest"

            ||

            (

                state.phase ===
                "exercise"

                &&

                isTimed(
                    exercise
                )

            )

        ) {

            state.remainingSeconds =
                calculateRemaining();

        }


        const savedAt =
            Date.now();


        const snapshot = {
            ...state
        };


        if (

            snapshot.isPaused

            &&

            snapshot.pausedAt

        ) {

            snapshot.totalPausedMs =

                (

                    snapshot.totalPausedMs

                    ||

                    0

                )

                +

                Math.max(

                    0,

                    savedAt

                    -

                    snapshot.pausedAt

                );

        }


        /*
            Khi reload:
            - session luôn mở lại ở paused
            - countdown không tự chạy
            - người dùng phải chủ động bấm Tiếp tục
        */

        snapshot.phaseEndsAt =
            null;


        snapshot.isPaused =
            true;


        snapshot.pausedAt =
            null;


        write(

            STORAGE.active,

            {

                version:
                    2,

                savedAt:
                    savedAt,

                session:
                    session,

                state:
                    snapshot

            }

        );

    }


    function clearSaved() {

        remove(
            STORAGE.active
        );

    }


    /* =====================================================
       16. HISTORY
    ====================================================== */

    function addHistory(
        summaryItem
    ) {

        const history =
            read(
                STORAGE.history
            );


        const items =
            Array.isArray(
                history
            )

                ? history

                : [];


        items.unshift(
            summaryItem
        );


        /*
            Chỉ giữ 20 session gần nhất.
        */

        write(

            STORAGE.history,

            items.slice(
                0,
                20
            )

        );

    }


    /* =====================================================
       17. SESSION STYLE BRIDGE

       CSS đã được chuyển hoàn toàn sang:
       css/personal-plan.css

       Không inject <style> từ JS nữa.
    ====================================================== */

    function ensureStyles() {

        return true;

    }


    /* =====================================================
       18. CREATE SESSION UI
    ====================================================== */

    function ensureUI() {

        ensureStyles();


        root =
            document.getElementById(
                "sporthubWorkoutSession"
            );


        if (
            root
        ) {

            return root;

        }


        root =
            document.createElement(
                "div"
            );


        root.id =
            "sporthubWorkoutSession";


        root.className =
            "shws-root";


        root.setAttribute(
            "role",
            "dialog"
        );


        root.setAttribute(
            "aria-modal",
            "true"
        );


        root.setAttribute(
            "aria-label",
            "Chế độ tập luyện SPORTHUB"
        );


        root.setAttribute(
            "aria-hidden",
            "true"
        );


        root.addEventListener(
            "click",
            handleClick
        );


        document.body.appendChild(
            root
        );


        return root;

    }


    function openUI() {

        const ui =
            ensureUI();


        ui.classList.add(
            "is-open"
        );


        ui.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body
            .classList
            .add(
                "shws-lock"
            );

    }


    function closeUI() {

        root
            ?.classList
            .remove(
                "is-open"
            );


        root
            ?.setAttribute(
                "aria-hidden",
                "true"
            );


        document.body
            .classList
            .remove(
                "shws-lock"
            );

    }


    /* =====================================================
       19. BUTTON EVENTS
    ====================================================== */

    function handleClick(
        event
    ) {

        const button =
            event.target
                .closest(
                    "[data-shws-action]"
                );


        if (
            !button
        ) {

            return;

        }


        const action =
            button.dataset
                .shwsAction;


        if (
            action ===
            "toggle-pause"
        ) {

            state.isPaused

                ? resume()

                : pause();

        }

        else if (
            action ===
            "complete-set"
        ) {

            completeSet(
                false
            );

        }

        else if (
            action ===
            "skip-rest"
        ) {

            skipRest();

        }

        else if (
            action ===
            "next-exercise"
        ) {

            nextExercise(
                true
            );

        }

        else if (
            action ===
            "stop"
        ) {

            stop(
                true
            );

        }

        else if (
            action ===
            "close"
        ) {

            closeUI();

        }

    }


    /* =====================================================
       20. LIST BUILDER
    ====================================================== */

    function buildList(
        items
    ) {

        if (

            !Array.isArray(
                items
            )

            ||

            !items.length

        ) {

            return "";

        }


        return `

            <ul>

                ${
                    items

                        .map(

                            item =>

                                `<li>${escapeHTML(
                                    item
                                )}</li>`

                        )

                        .join(
                            ""
                        )
                }

            </ul>

        `;

    }


    /* =====================================================
       21. MAIN SESSION RENDER
    ====================================================== */

    function render() {

        ensureUI();


        if (

            state.status ===
            "completed"

            ||

            state.status ===
            "stopped"

        ) {

            renderComplete();


            return;

        }


        const exercise =
            currentExercise();


        if (
            !exercise
        ) {

            finishWorkout();


            return;

        }


        const exerciseList =
            exercises();


        const next =
            nextExerciseData();


        const video =
            mediaFor(
                exercise
            );


        const sets =
            setsOf(
                exercise
            );


        const timed =
            isTimed(
                exercise
            );


        const rest =
            restSecondsOf(
                exercise
            );


        const phaseLabel =

            state.isPaused

                ? "Đang tạm dừng"

                : state.phase ===
                  "rest"

                    ? "Nghỉ giữa hiệp"

                    : "Đang tập";


        let mainValue;

        let mainLabel;


        if (
            state.phase ===
            "rest"
        ) {

            mainValue =
                formatTime(
                    state.remainingSeconds
                );


            mainLabel =

                state.pendingAction ===
                "next-exercise"

                    ? "Chuẩn bị chuyển sang bài tiếp theo"

                    : `Chuẩn bị Set ${
                        state.pendingSet
                        ||
                        state.currentSet + 1
                    }`;

        }

        else if (
            timed
        ) {

            mainValue =
                formatTime(
                    state.remainingSeconds
                );


            mainLabel =
                `Mục tiêu gốc: ${
                    exercise.reps
                    ||
                    "Theo thời gian"
                }`;

        }

        else {

            mainValue =
                escapeHTML(

                    exercise.reps

                    ||

                    "Theo khả năng"

                );


            mainLabel =
                "Tập đủ reps với kỹ thuật kiểm soát, sau đó bấm Hoàn thành set.";

        }


        const nextText =

            state.phase ===
            "rest"

            &&

            state.pendingAction ===
            "next-set"

                ? `${
                    exercise.name
                    ||
                    "Bài hiện tại"
                } - Set ${
                    state.pendingSet
                }`

                : next?.name

                  ||

                  "Hoàn thành buổi tập";


        const primaryAction =

            state.phase ===
            "rest"

                ? `

                    <button

                        type="button"

                        class="
                            shws-btn
                            shws-primary
                        "

                        data-shws-action="skip-rest"

                        ${
                            state.isPaused

                                ? "disabled"

                                : ""
                        }

                    >

                        Bỏ qua thời gian nghỉ

                    </button>

                `

                : timed

                    ? `

                        <button

                            type="button"

                            class="
                                shws-btn
                                shws-primary
                            "

                            disabled

                        >

                            ⏱ Timer đang chạy tự động

                        </button>

                    `

                    : `

                        <button

                            type="button"

                            class="
                                shws-btn
                                shws-primary
                            "

                            data-shws-action="complete-set"

                            ${
                                state.isPaused

                                    ? "disabled"

                                    : ""
                            }

                        >

                            Hoàn thành set

                        </button>

                    `;


        root.innerHTML = `

            <div class="shws-shell">


                <div class="shws-topbar">


                    <div>


                        <div class="shws-kicker">

                            SPORTHUB WORKOUT SESSION

                        </div>


                        <h2 class="shws-session-title">

                            ${
                                escapeHTML(

                                    state.sessionName

                                    ||

                                    session?.name

                                    ||

                                    "Buổi tập"

                                )
                            }

                        </h2>


                    </div>


                    <button

                        type="button"

                        class="shws-stop"

                        data-shws-action="stop"

                    >

                        Dừng buổi tập

                    </button>


                </div>


                <div class="shws-progress">

                    <div

                        id="shwsProgress"

                        style="
                            width:
                            ${progressPercent()}%;
                        "

                    ></div>

                </div>


                <div class="shws-grid">


                    <div>


                        <div class="shws-card">


                            <div class="shws-video-wrap">


                                <div class="shws-badge">

                                    Bài

                                    ${state.exerciseIndex + 1}

                                    /

                                    ${exerciseList.length}

                                </div>


                                ${
                                    video

                                        ? `

                                            <video

                                                id="shwsVideo"

                                                class="shws-video"

                                                playsinline

                                                muted

                                                loop

                                                preload="metadata"

                                                ${
                                                    state.phase ===
                                                    "exercise"

                                                        ? "autoplay"

                                                        : ""
                                                }

                                            >

                                                <source

                                                    src="${escapeHTML(
                                                        video
                                                    )}"

                                                    type="video/mp4"

                                                >

                                            </video>

                                        `

                                        : `

                                            <div class="shws-video-empty">


                                                <div>


                                                    <strong>

                                                        Video hướng dẫn chưa có cho bài này.

                                                    </strong>


                                                    <br>


                                                    Bạn vẫn có thể tập theo hướng dẫn kỹ thuật bên dưới.


                                                </div>


                                            </div>

                                        `
                                }


                            </div>


                        </div>


                        <div
                            class="
                                shws-card
                                shws-info
                            "
                        >


                            ${
                                exercise.target

                                    ? `

                                        <p>

                                            <strong>
                                                Mục tiêu:
                                            </strong>

                                            ${
                                                escapeHTML(
                                                    exercise.target
                                                )
                                            }

                                        </p>

                                    `

                                    : ""
                            }


                            ${
                                exercise.technique
                                    ?.length

                                    ? `

                                        <details open>

                                            <summary>
                                                Hướng dẫn kỹ thuật
                                            </summary>

                                            ${
                                                buildList(
                                                    exercise.technique
                                                )
                                            }

                                        </details>

                                    `

                                    : ""
                            }


                            ${
                                exercise.mistakes
                                    ?.length

                                    ? `

                                        <details>

                                            <summary>
                                                Lỗi thường gặp
                                            </summary>

                                            ${
                                                buildList(
                                                    exercise.mistakes
                                                )
                                            }

                                        </details>

                                    `

                                    : ""
                            }


                            ${
                                exercise.stopCondition

                                    ? `

                                        <details>

                                            <summary>
                                                Khi nào nên dừng?
                                            </summary>

                                            <p>

                                                ${
                                                    escapeHTML(
                                                        exercise.stopCondition
                                                    )
                                                }

                                            </p>

                                        </details>

                                    `

                                    : ""
                            }


                        </div>


                    </div>


                    <div
                        class="
                            shws-card
                            shws-control
                        "
                    >


                        <span class="shws-phase">

                            ${
                                escapeHTML(
                                    phaseLabel
                                )
                            }

                        </span>


                        <h2 class="shws-name">

                            ${
                                escapeHTML(

                                    exercise.name

                                    ||

                                    "Bài tập"

                                )
                            }

                        </h2>


                        <p class="shws-count">

                            Bài

                            ${state.exerciseIndex + 1}

                            /

                            ${exerciseList.length}

                            ·

                            Set

                            ${state.currentSet}

                            /

                            ${sets}

                        </p>


                        <div

                            id="shwsMain"

                            class="shws-main"

                        >

                            ${mainValue}

                        </div>


                        <p class="shws-label">

                            ${
                                escapeHTML(
                                    mainLabel
                                )
                            }

                        </p>


                        <div class="shws-meta-grid">


                            <div class="shws-meta">

                                <span>
                                    Set
                                </span>

                                <strong>

                                    ${state.currentSet}

                                    /

                                    ${sets}

                                </strong>

                            </div>


                            <div class="shws-meta">

                                <span>
                                    Nghỉ đề xuất
                                </span>

                                <strong>

                                    ${
                                        rest

                                            ? formatTime(
                                                rest
                                            )

                                            : "Không áp dụng"
                                    }

                                </strong>

                            </div>


                            <div class="shws-meta">

                                <span>
                                    Cường độ
                                </span>

                                <strong>

                                    ${
                                        escapeHTML(

                                            exercise.rpe

                                            ||

                                            "Theo kế hoạch"

                                        )
                                    }

                                </strong>

                            </div>


                            <div class="shws-meta">

                                <span>
                                    Đã tập
                                </span>

                                <strong id="shwsElapsed">

                                    ${
                                        formatTime(
                                            elapsedSeconds()
                                        )
                                    }

                                </strong>

                            </div>


                        </div>


                        <div class="shws-actions">


                            ${primaryAction}


                            <button

                                type="button"

                                class="shws-btn"

                                data-shws-action="toggle-pause"

                            >

                                ${
                                    state.isPaused

                                        ? "▶ Tiếp tục"

                                        : "⏸ Tạm dừng"
                                }

                            </button>


                            <button

                                type="button"

                                class="shws-btn"

                                data-shws-action="next-exercise"

                                ${
                                    state.isPaused

                                    ||

                                    state.exerciseIndex
                                    >=
                                    exerciseList.length - 1

                                        ? "disabled"

                                        : ""
                                }

                            >

                                ⏭ Bài tiếp theo

                            </button>


                        </div>


                        <div class="shws-next">


                            Tiếp theo:


                            <br>


                            <strong>

                                ${
                                    escapeHTML(
                                        nextText
                                    )
                                }

                            </strong>


                        </div>


                        <div class="shws-status">


                            <span>

                                Hoàn thành

                                ${state.completedSets}

                                /

                                ${totalSets()}

                                set

                            </span>


                            <span>

                                ${
                                    Math.round(
                                        progressPercent()
                                    )
                                }%

                            </span>


                        </div>


                    </div>


                </div>


            </div>

        `;


        syncVideo();


        updateDynamicUI();

    }


    /* =====================================================
       22. DYNAMIC UI
    ====================================================== */

    function updateDynamicUI() {

        if (
            !root
        ) {

            return;

        }


        const elapsed =
            root.querySelector(
                "#shwsElapsed"
            );


        if (
            elapsed
        ) {

            elapsed.textContent =
                formatTime(
                    elapsedSeconds()
                );

        }


        const progress =
            root.querySelector(
                "#shwsProgress"
            );


        if (
            progress
        ) {

            progress.style.width =
                `${progressPercent()}%`;

        }


        const main =
            root.querySelector(
                "#shwsMain"
            );


        const exercise =
            currentExercise();


        const timed =

            state.phase ===
            "exercise"

            &&

            isTimed(
                exercise
            );


        if (

            main

            &&

            (

                state.phase ===
                "rest"

                ||

                timed

            )

        ) {

            main.textContent =
                formatTime(
                    state.remainingSeconds
                );

        }

    }


    /* =====================================================
       23. VIDEO CONTROL
    ====================================================== */

    function syncVideo() {

        const video =
            root
                ?.querySelector(
                    "#shwsVideo"
                );


        if (
            !video
        ) {

            return;

        }


        if (

            state.phase ===
            "exercise"

            &&

            !state.isPaused

            &&

            state.status ===
            "active"

        ) {

            const playPromise =
                video.play();


            if (
                playPromise?.catch
            ) {

                playPromise.catch(
                    () => {}
                );

            }

        }

        else {

            video.pause();

        }

    }


    /* =====================================================
       24. COMPLETE SCREEN
    ====================================================== */

    function renderComplete() {

        if (
            !root
        ) {

            return;

        }


        const completed =

            state.status ===
            "completed";


        root.innerHTML = `

            <div
                class="
                    shws-shell
                    shws-complete
                "
            >


                <div class="shws-complete-card">


                    <div class="shws-complete-icon">

                        ${
                            completed

                                ? "✓"

                                : "■"
                        }

                    </div>


                    <div class="shws-kicker">

                        ${
                            completed

                                ? "HOÀN THÀNH BUỔI TẬP"

                                : "BUỔI TẬP ĐÃ DỪNG"
                        }

                    </div>


                    <h2>

                        ${
                            escapeHTML(

                                state.sessionName

                                ||

                                "Buổi tập"

                            )
                        }

                    </h2>


                    <p>


                        Thời gian hoạt động:


                        <strong>

                            ${
                                formatTime(
                                    elapsedSeconds()
                                )
                            }

                        </strong>


                        <br>


                        Set hoàn thành:


                        <strong>

                            ${state.completedSets}

                            /

                            ${totalSets()}

                        </strong>


                        <br>


                        Bài đã hoàn thành:


                        <strong>

                            ${state.completedExercises}

                            /

                            ${exercises().length}

                        </strong>


                        <br>


                        Bài đã bỏ qua:


                        <strong>

                            ${state.skippedExercises}

                        </strong>


                    </p>


                    <button

                        type="button"

                        class="
                            shws-btn
                            shws-primary
                            shws-complete-btn
                        "

                        data-shws-action="close"

                    >

                        Trở về kế hoạch tập luyện

                    </button>


                </div>


            </div>

        `;

    }


    /* =====================================================
       25. START EXERCISE PHASE
    ====================================================== */

    function startExercisePhase() {

        const exercise =
            currentExercise();


        if (
            !exercise
        ) {

            finishWorkout();


            return;

        }


        clearTimer();


        state.phase =
            "exercise";


        state.pendingAction =
            null;


        state.pendingSet =
            null;


        state.isPaused =
            false;


        state.pausedAt =
            null;


        const duration =
            durationSecondsOf(
                exercise
            );


        if (
            duration > 0
        ) {

            setCountdown(
                duration
            );

        }

        else {

            state.remainingSeconds =
                0;


            state.phaseEndsAt =
                null;

        }


        render();


        saveActive();


        emit(

            "sporthub:workout-exercise-start",

            {

                exercise:
                    exercise,

                exerciseIndex:
                    state.exerciseIndex,

                set:
                    state.currentSet

            }

        );

    }


    /* =====================================================
       26. REST
    ====================================================== */

    function startRest(
        pendingAction,
        pendingSet = null
    ) {

        const exercise =
            currentExercise();


        if (
            !exercise
        ) {

            finishWorkout();


            return;

        }


        const rest =
            restSecondsOf(
                exercise
            );


        state.phase =
            "rest";


        state.pendingAction =
            pendingAction;


        state.pendingSet =
            pendingSet;


        state.isPaused =
            false;


        state.pausedAt =
            null;


        if (
            rest <= 0
        ) {

            finishRest();


            return;

        }


        setCountdown(
            rest
        );


        render();


        saveActive();


        emit(

            "sporthub:workout-rest-start",

            {

                restSeconds:
                    rest,

                pendingAction:
                    pendingAction,

                pendingSet:
                    pendingSet

            }

        );

    }


    function finishRest() {

        clearTimer();


        const action =
            state.pendingAction;


        const nextSet =
            state.pendingSet;


        state.remainingSeconds =
            0;


        state.phaseEndsAt =
            null;


        state.pendingAction =
            null;


        state.pendingSet =
            null;


        if (
            action ===
            "next-set"
        ) {

            state.currentSet =

                nextSet

                ||

                state.currentSet
                +
                1;


            startExercisePhase();


            return;

        }


        if (
            action ===
            "next-exercise"
        ) {

            moveNextExercise(
                false
            );


            return;

        }


        startExercisePhase();

    }


    /* =====================================================
       27. COMPLETE SET
    ====================================================== */

    function completeSet(
        fromTimer = false
    ) {

        if (

            state.status !==
            "active"

            ||

            state.isPaused

            ||

            state.phase !==
            "exercise"

        ) {

            return false;

        }


        const exercise =
            currentExercise();


        if (
            !exercise
        ) {

            return false;

        }


        if (

            isTimed(
                exercise
            )

            &&

            !fromTimer

        ) {

            return false;

        }


        clearTimer();


        state.completedSets++;


        const lastSet =

            state.currentSet

            >=

            setsOf(
                exercise
            );


        const lastExercise =

            state.exerciseIndex

            >=

            exercises().length

            -

            1;


        emit(

            "sporthub:workout-set-complete",

            {

                exercise:
                    exercise,

                exerciseIndex:
                    state.exerciseIndex,

                set:
                    state.currentSet,

                fromTimer:
                    fromTimer

            }

        );


        if (
            !lastSet
        ) {

            startRest(

                "next-set",

                state.currentSet
                +
                1

            );


            return true;

        }


        state.completedExercises++;


        if (
            lastExercise
        ) {

            finishWorkout();


            return true;

        }


        if (

            restSecondsOf(
                exercise
            )

            >

            0

        ) {

            startRest(
                "next-exercise"
            );


            return true;

        }


        moveNextExercise(
            false
        );


        return true;

    }


    /* =====================================================
       28. NEXT EXERCISE
    ====================================================== */

    function moveNextExercise(
        markSkipped
    ) {

        if (
            markSkipped
        ) {

            state.skippedExercises++;

        }


        if (

            state.exerciseIndex

            >=

            exercises().length

            -

            1

        ) {

            finishWorkout();


            return;

        }


        clearTimer();


        state.exerciseIndex++;


        state.currentSet =
            1;


        state.remainingSeconds =
            0;


        state.phaseEndsAt =
            null;


        state.pendingAction =
            null;


        state.pendingSet =
            null;


        state.isPaused =
            false;


        state.pausedAt =
            null;


        startExercisePhase();

    }


    function nextExercise(
        confirmSkip = false
    ) {

        if (

            state.status !==
            "active"

            ||

            state.isPaused

        ) {

            return false;

        }


        if (

            state.exerciseIndex

            >=

            exercises().length

            -

            1

        ) {

            return false;

        }


        if (
            confirmSkip
        ) {

            const confirmed =
                window.confirm(

                    "Bỏ qua phần còn lại của bài hiện tại và chuyển sang bài tiếp theo?"

                );


            if (
                !confirmed
            ) {

                return false;

            }

        }


        moveNextExercise(
            true
        );


        return true;

    }


    /* =====================================================
       29. SKIP REST
    ====================================================== */

    function skipRest() {

        if (

            state.status !==
            "active"

            ||

            state.phase !==
            "rest"

            ||

            state.isPaused

        ) {

            return false;

        }


        clearTimer();


        beep();


        finishRest();


        return true;

    }


    /* =====================================================
       30. PAUSE
    ====================================================== */

    function pause() {

        if (

            state.status !==
            "active"

            ||

            state.isPaused

        ) {

            return false;

        }


        const exercise =
            currentExercise();


        if (

            state.phase ===
            "rest"

            ||

            (

                state.phase ===
                "exercise"

                &&

                isTimed(
                    exercise
                )

            )

        ) {

            state.remainingSeconds =
                calculateRemaining();


            state.phaseEndsAt =
                null;

        }


        clearTimer();


        state.isPaused =
            true;


        state.pausedAt =
            Date.now();


        render();


        saveActive();


        emit(
            "sporthub:workout-pause"
        );


        return true;

    }


    /* =====================================================
       31. RESUME
    ====================================================== */

    function resume() {

        if (

            state.status !==
            "active"

            ||

            !state.isPaused

        ) {

            return false;

        }


        if (
            state.pausedAt
        ) {

            state.totalPausedMs +=

                Date.now()

                -

                state.pausedAt;

        }


        state.isPaused =
            false;


        state.pausedAt =
            null;


        const exercise =
            currentExercise();


        const needsCountdown =

            state.phase ===
            "rest"

            ||

            (

                state.phase ===
                "exercise"

                &&

                isTimed(
                    exercise
                )

            );


        if (
            needsCountdown
        ) {

            if (
                state.remainingSeconds > 0
            ) {

                state.phaseEndsAt =

                    Date.now()

                    +

                    state.remainingSeconds

                    *

                    1000;


                startTimer();

            }

            else if (
                state.phase ===
                "rest"
            ) {

                finishRest();


                return true;

            }

            else {

                completeSet(
                    true
                );


                return true;

            }

        }


        render();


        saveActive();


        emit(
            "sporthub:workout-resume"
        );


        return true;

    }


    /* =====================================================
       32. START SESSION
    ====================================================== */

function startSession(
    inputSession,
    options = {}
) {

    if (
        !inputSession
    ) {

        message(
            "Không tìm thấy buổi tập."
        );


        return false;

    }


    if (
        state.status ===
        "active"

        ||

        hasSavedSession()
    ) {

        message(
            "Bạn đang có một buổi tập dang dở. Hãy tiếp tục hoặc dừng buổi tập đó trước khi bắt đầu buổi mới."
        );


        return false;

    }


    if (
        isSafetyBlocked()
    ) {

        message(

            "Safety Gate đang chặn tự động hóa buổi tập. Hãy xem lại kết quả Fitness Check trước khi bắt đầu."

        );


        return false;

    }


    if (
        inputSession.type ===
        "Recovery"
    ) {

        message(

            "Ngày này là ngày phục hồi, không có workout session để chạy."

        );


        return false;

    }


    if (

        !Array.isArray(
            inputSession.exercises
        )

        ||

        !inputSession.exercises
            .filter(
                Boolean
            )
            .length

    ) {

        message(
            "Buổi tập chưa có bài tập để bắt đầu."
        );


        return false;

    }


    prepareAudio();


    clearTimer();


    /*
        Clone session để UI không sửa
        trực tiếp plan đang nằm trong localStorage.
    */

    session =
        JSON.parse(

            JSON.stringify(
                inputSession
            )

        );


    state =
        createInitialState();


    state.status =
        "active";


    state.phase =
        "exercise";


    state.exerciseIndex =
        0;


    state.currentSet =
        1;


    state.startedAt =
        Date.now();


    state.dayIndex =

        Number.isInteger(
            options.dayIndex
        )

            ? options.dayIndex

            : null;


    state.sessionName =

        inputSession.name

        ||

        "Buổi tập";


    state.sessionType =

        inputSession.type

        ||

        "Workout";


    openUI();


    startExercisePhase();


    emit(

        "sporthub:workout-start",

        {

            dayIndex:
                state.dayIndex

        }

    );


    return true;

}


    /* =====================================================
       33. START DAY
    ====================================================== */

    function startDay(
        dayIndex
    ) {

        const workout =
            getStoredPlan();


        if (
            !workout
        ) {

            message(

                "Chưa có kế hoạch tập luyện. Hãy hoàn thành Fitness Check trước."

            );


            return false;

        }


        if (

            workout.blocked

            ||

            workout.success ===
            false

        ) {

            message(

                workout.reason

                ||

                workout.error

                ||

                "Kế hoạch tập hiện chưa sẵn sàng."

            );


            return false;

        }


        const schedule =

            Array.isArray(
                workout.schedule
            )

                ? workout.schedule

                : [];


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

            index >=
            schedule.length

        ) {

            message(
                "Ngày tập không hợp lệ."
            );


            return false;

        }


        return startSession(

            schedule[
                index
            ],

            {

                dayIndex:
                    index

            }

        );

    }


    function startToday() {

        return startDay(
            todayIndex()
        );

    }


    /* =====================================================
       34. SESSION SUMMARY
    ====================================================== */

    function summary(
        status
    ) {

        return {

            status:
                status,

            sessionName:

                state.sessionName

                ||

                session?.name

                ||

                "Buổi tập",

            sessionType:

                state.sessionType

                ||

                session?.type

                ||

                "Workout",

            dayIndex:
                state.dayIndex,

            dayName:

                Number.isInteger(
                    state.dayIndex
                )

                    ? DAY_NAMES[
                        state.dayIndex
                    ]

                    : null,

            startedAt:

                state.startedAt

                    ? new Date(
                        state.startedAt
                    )
                        .toISOString()

                    : null,

            endedAt:

                state.endedAt

                    ? new Date(
                        state.endedAt
                    )
                        .toISOString()

                    : new Date()
                        .toISOString(),

            durationSeconds:
                elapsedSeconds(),

            completedSets:
                state.completedSets,

            totalSets:
                totalSets(),

            completedExercises:
                state.completedExercises,

            totalExercises:
                exercises().length,

            skippedExercises:
                state.skippedExercises

        };

    }


    /* =====================================================
       35. FINISH WORKOUT
    ====================================================== */

    function finishWorkout() {

        if (
            state.status !==
            "active"
        ) {

            return false;

        }


        clearTimer();


        beep();


        state.status =
            "completed";


        state.phase =
            "complete";


        state.endedAt =
            Date.now();


        state.isPaused =
            false;


        state.pausedAt =
            null;


        state.phaseEndsAt =
            null;


        state.remainingSeconds =
            0;


        clearSaved();


        const result =
            summary(
                "completed"
            );


        addHistory(
            result
        );


        renderComplete();


        emit(

            "sporthub:workout-complete",

            {

                summary:
                    result

            }

        );


        return true;

    }


    /* =====================================================
       36. STOP WORKOUT
    ====================================================== */

    function stop(
        requireConfirm = true
    ) {

        if (
            state.status !==
            "active"
        ) {

            return false;

        }


        if (
            requireConfirm
        ) {

            const confirmed =
                window.confirm(

                    "Bạn muốn dừng buổi tập? Tiến độ hiện tại sẽ được lưu vào lịch sử."

                );


            if (
                !confirmed
            ) {

                return false;

            }

        }


        clearTimer();


        /*
            Nếu user dừng trong lúc pause,
            chốt thời gian pause trước khi summary.
        */

        commitPausedDuration();


        state.status =
            "stopped";


        state.phase =
            "stopped";


        state.endedAt =
            Date.now();


        state.isPaused =
            false;


        state.pausedAt =
            null;


        state.phaseEndsAt =
            null;


        clearSaved();


        const result =
            summary(
                "stopped"
            );


        addHistory(
            result
        );


        renderComplete();


        emit(

            "sporthub:workout-stop",

            {

                summary:
                    result

            }

        );


        return true;

    }


    /* =====================================================
       37. SAVED SESSION
    ====================================================== */

    function hasSavedSession() {

        const saved =
            read(
                STORAGE.active
            );


        return Boolean(

            saved?.session

            &&

            saved?.state

        );

    }


    function resumeSaved() {

        const saved =
            read(
                STORAGE.active
            );


        if (

            !saved?.session

            ||

            !saved?.state

        ) {

            return false;

        }


        if (
            isSafetyBlocked()
        ) {


            message(

                "Safety Gate hiện không cho phép tiếp tục buổi tập đã lưu."

            );


            return false;

        }


        prepareAudio();


        clearTimer();


        session =
            saved.session;


        const now =
            Date.now();


        const savedAt =
            Number(
                saved.savedAt
            );


        /*
            Thời gian tab bị đóng / reload
            được tính như thời gian paused,
            không tính vào workout duration.
        */

        const offlinePausedMs =

            Number.isFinite(
                savedAt
            )

            &&

            savedAt > 0

                ? Math.max(

                    0,

                    now

                    -

                    savedAt

                )

                : 0;


        state = {

            ...createInitialState(),

            ...saved.state,

            status:
                "active",

            totalPausedMs:

                (

                    Number(
                        saved.state.totalPausedMs
                    )

                    ||

                    0

                )

                +

                offlinePausedMs,

            isPaused:
                true,

            pausedAt:
                now,

            phaseEndsAt:
                null

        };


        openUI();


        render();


        emit(
            "sporthub:workout-resume-saved"
        );


        return true;

    }


    /* =====================================================
       38. PUBLIC STATE
    ====================================================== */

    function getState() {

        return {

            ...state,

            totalSets:
                totalSets(),

            totalExercises:
                exercises().length,

            progressPercent:
                progressPercent(),

            elapsedSeconds:
                elapsedSeconds(),

            currentExercise:
                currentExercise(),

            nextExercise:
                nextExerciseData()

        };

    }


    function getHistory() {

        const history =
            read(
                STORAGE.history
            );


        return Array.isArray(
            history
        )

            ? history

            : [];

    }


    function isRunning() {

        return (

            state.status ===
            "active"

        );

    }


    /* =====================================================
       39. PAGE LIFECYCLE
    ====================================================== */

    window.addEventListener(

        "beforeunload",

        () => {

            if (
                state.status ===
                "active"
            ) {

                saveActive();

            }

        }

    );


    document.addEventListener(

        "visibilitychange",

        () => {

            if (

                document.visibilityState ===
                "visible"

                &&

                state.status ===
                "active"

                &&

                !state.isPaused

            ) {

                /*
                    Timer dùng timestamp nên khi quay lại tab
                    sẽ cập nhật đúng thời gian thực tế.
                */

                tick();

            }

        }

    );


    /* =====================================================
       40. PUBLIC API

       Giữ tương thích workout-plan.js hiện tại.
    ====================================================== */

    return {

        startDay:
            startDay,

        startToday:
            startToday,

        startSession:
            startSession,

        pause:
            pause,

        resume:
            resume,

        completeSet:
            completeSet,

        skipRest:
            skipRest,

        nextExercise:
            nextExercise,

        stop:
            stop,

        resumeSaved:
            resumeSaved,

        hasSavedSession:
            hasSavedSession,

        getState:
            getState,

        getHistory:
            getHistory,

        isRunning:
            isRunning,

        listAvailableDays:
            listAvailableDays,

        /*
            Giữ public media registry
            để workout-plan.js cũ vẫn có fallback.
        */

        media:
            MEDIA

    };

})();