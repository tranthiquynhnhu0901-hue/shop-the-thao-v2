/* =========================================================
   SPORTHUB PERSONAL PLAN DATA
   Version 1.0

   Nhiệm vụ:
   - Đọc dữ liệu Fitness Check từ localStorage
   - Chuẩn hóa quyền truy cập dữ liệu cho các trang:
     + ke-hoach-suc-khoe.html
     + ke-hoach-tap-luyen.html
     + ke-hoach-dinh-duong.html

   Không chạy lại:
   - Health Engine
   - Workout Engine
   - Nutrition Engine

   Không sửa dữ liệu engine đã tạo.
========================================================= */

window.SportHubPersonalPlan = (() => {

    "use strict";


    /* =====================================================
       1. STORAGE KEYS
    ====================================================== */

    const STORAGE = {

        profile:
            "sporthub_fitness_profile",

        health:
            "sporthub_fitness_analysis",

        workout:
            "sporthub_workout_plan",

        nutrition:
            "sporthub_nutrition_plan",

        activeWorkout:
            "sporthub_workout_active_session",

        workoutHistory:
            "sporthub_workout_history"

    };


    /* =====================================================
       2. SAFE JSON
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


    /* =====================================================
       3. SAFE STORAGE READ
    ====================================================== */

    function readStorage(
        key
    ) {

        if (!key) {

            return null;

        }


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
       4. DATA GETTERS
    ====================================================== */

    function getProfile() {

        return readStorage(
            STORAGE.profile
        );

    }


    function getHealth() {

        return readStorage(
            STORAGE.health
        );

    }


    function getWorkout() {

        return readStorage(
            STORAGE.workout
        );

    }


    function getNutrition() {

        return readStorage(
            STORAGE.nutrition
        );

    }


    function getActiveWorkout() {

        return readStorage(
            STORAGE.activeWorkout
        );

    }


    function getWorkoutHistory() {

        const history =
            readStorage(
                STORAGE.workoutHistory
            );


        return Array.isArray(
            history
        )
            ? history
            : [];

    }


    /* =====================================================
       5. COMPLETE DATA SNAPSHOT
    ====================================================== */

    function getAll() {

        return {

            profile:
                getProfile(),

            health:
                getHealth(),

            workout:
                getWorkout(),

            nutrition:
                getNutrition(),

            activeWorkout:
                getActiveWorkout(),

            workoutHistory:
                getWorkoutHistory()

        };

    }


    /* =====================================================
       6. FITNESS CHECK STATE
    ====================================================== */

    function hasProfile() {

        return Boolean(
            getProfile()
        );

    }


    function hasHealthAnalysis() {

        const health =
            getHealth();


        return Boolean(
            health
        );

    }


    function hasWorkoutPlan() {

        const workout =
            getWorkout();


        return Boolean(
            workout
        );

    }


    function hasNutritionPlan() {

        const nutrition =
            getNutrition();


        return Boolean(
            nutrition
        );

    }


    function hasFitnessCheck() {

        return Boolean(

            getProfile()

            &&

            getHealth()

        );

    }


    /* =====================================================
       7. ENGINE RESULT HELPERS
    ====================================================== */

    function isSuccessful(
        result
    ) {

        return Boolean(

            result

            &&

            result.success ===
            true

        );

    }


    function isBlocked(
        result
    ) {

        return Boolean(

            result

            &&

            result.blocked ===
            true

        );

    }


    function getResultError(
        result
    ) {

        if (!result) {

            return "";

        }


        return String(

            result.error

            ||

            result.reason

            ||

            ""

        ).trim();

    }


    /* =====================================================
       8. SAFETY
    ====================================================== */

    function getSafety() {

        const health =
            getHealth();


        return health
            ?.safety
            || null;

    }


    function getSafetyLevel() {

        return getSafety()
            ?.level
            || "";

    }


    function allowsFullAutomation() {

        const safety =
            getSafety();


        if (!safety) {

            return false;

        }


        return (
            safety.allowFullAutomation
            !==
            false
        );

    }


    function isSafetyBlocked() {

        const safety =
            getSafety();


        return Boolean(

            safety

            &&

            safety.allowFullAutomation
            ===
            false

        );

    }


    /* =====================================================
       9. BODY
    ====================================================== */

    function getBody() {

        return getHealth()
            ?.body
            || null;

    }


    function getBMI() {

        return getBody()
            ?.bmi
            || null;

    }


    function getRMR() {

        return getBody()
            ?.rmr
            || null;

    }


    /* =====================================================
       10. ENERGY
    ====================================================== */

    function getEnergy() {

        return getHealth()
            ?.energy
            || null;

    }


    function getActivityFactor() {

        return getEnergy()
            ?.activityFactor
            || null;

    }


    function getTDEE() {

        return getEnergy()
            ?.tdee
            || null;

    }


    function getCalorieTarget() {

        return getEnergy()
            ?.calorieTarget
            || null;

    }


    /* =====================================================
       11. HEALTH NUTRITION
    ====================================================== */

    function getHealthNutrition() {

        return getHealth()
            ?.nutrition
            || null;

    }


    function getProteinTarget() {

        return getHealthNutrition()
            ?.protein
            || null;

    }


    function getFatTarget() {

        return getHealthNutrition()
            ?.fat
            || null;

    }


    function getCarbTarget() {

        return getHealthNutrition()
            ?.carbs
            || null;

    }


    /* =====================================================
       12. RECOVERY
    ====================================================== */

    function getRecovery() {

        return getHealth()
            ?.recovery
            || null;

    }


    /* =====================================================
       13. PROFILE SUBSECTIONS
    ====================================================== */

    function getTrainingProfile() {

        return getProfile()
            ?.training
            || null;

    }


    function getNutritionProfile() {

        return getProfile()
            ?.nutrition
            || null;

    }


    function getRecoveryProfile() {

        return getProfile()
            ?.recovery
            || null;

    }


    function getActivityProfile() {

        return getProfile()
            ?.activity
            || null;

    }


    function getGoal() {

        return getProfile()
            ?.goal
            || null;

    }


    /* =====================================================
       14. GOAL NAME
    ====================================================== */

    function getGoalName(
        value
    ) {

        const goal =
            value

            ||

            getGoal()
                ?.primary;


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
       15. PLAN STATUS
    ====================================================== */

    function getStatus() {

        const profile =
            getProfile();


        const health =
            getHealth();


        const workout =
            getWorkout();


        const nutrition =
            getNutrition();


        return {

            hasProfile:
                Boolean(
                    profile
                ),

            hasHealth:
                Boolean(
                    health
                ),

            hasWorkout:
                Boolean(
                    workout
                ),

            hasNutrition:
                Boolean(
                    nutrition
                ),

            healthSuccess:
                isSuccessful(
                    health
                ),

            workoutSuccess:
                isSuccessful(
                    workout
                ),

            nutritionSuccess:
                isSuccessful(
                    nutrition
                ),

            workoutBlocked:
                isBlocked(
                    workout
                ),

            nutritionBlocked:
                isBlocked(
                    nutrition
                ),

            safetyBlocked:
                isSafetyBlocked()

        };

    }


    /* =====================================================
       16. REFRESH EVENT

       Dùng khi sau này cần render lại trang đang mở
       sau khi dữ liệu localStorage thay đổi.
    ====================================================== */

    function notifyUpdate() {

        window.dispatchEvent(

            new CustomEvent(
                "sporthub:personal-plan-update",
                {
                    detail:
                        getAll()
                }
            )

        );

    }


    /* =====================================================
       17. PUBLIC API
    ====================================================== */

    return {

        version:
            "1.0",

        storage:
            STORAGE,

        readStorage,

        getProfile,

        getHealth,

        getWorkout,

        getNutrition,

        getActiveWorkout,

        getWorkoutHistory,

        getAll,

        hasProfile,

        hasHealthAnalysis,

        hasWorkoutPlan,

        hasNutritionPlan,

        hasFitnessCheck,

        isSuccessful,

        isBlocked,

        getResultError,

        getSafety,

        getSafetyLevel,

        allowsFullAutomation,

        isSafetyBlocked,

        getBody,

        getBMI,

        getRMR,

        getEnergy,

        getActivityFactor,

        getTDEE,

        getCalorieTarget,

        getHealthNutrition,

        getProteinTarget,

        getFatTarget,

        getCarbTarget,

        getRecovery,

        getTrainingProfile,

        getNutritionProfile,

        getRecoveryProfile,

        getActivityProfile,

        getGoal,

        getGoalName,

        getStatus,

        notifyUpdate

    };

})();