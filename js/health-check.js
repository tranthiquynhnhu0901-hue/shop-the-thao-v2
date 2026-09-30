/* =========================================================
   SPORTHUB FITNESS CHECK CONTROLLER
   Version 4.1
   Health + Workout + Nutrition
========================================================= */

let currentStep = 1;
const totalSteps = 7;

function el(id) {
    return document.getElementById(id);
}

function showMessage(message) {
    if (typeof toast === "function") {
        toast(message);
    } else {
        alert(message);
    }
}

function getRadioValue(name) {
    const checked = document.querySelector(
        `input[name="${name}"]:checked`
    );

    return checked
        ? checked.value
        : "";
}

function getEquipment() {
    return Array.from(
        document.querySelectorAll(
            ".equipment-item:checked"
        )
    ).map(
        item => item.value
    );
}

function escapeHTML(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
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


/* =========================================================
   STEP UI
========================================================= */

function showStep() {

    document
        .querySelectorAll(
            ".fitness-step"
        )
        .forEach(
            item => {
                item.classList.remove(
                    "active"
                );
            }
        );


    const activeStep =
        document.querySelector(
            `[data-step="${currentStep}"]`
        );


    if (activeStep) {
        activeStep.classList.add(
            "active"
        );
    }


    if (el("progress")) {

        el("progress").style.width =
            `${(currentStep / totalSteps) * 100}%`;

    }


    if (el("progressText")) {

        el("progressText").textContent =
            `Bước ${currentStep}/${totalSteps}`;

    }


    if (el("back")) {

        el("back").style.visibility =
            currentStep === 1
                ? "hidden"
                : "visible";

    }


    if (el("next")) {

        el("next").textContent =
            currentStep === totalSteps
                ? "PHÂN TÍCH & TẠO BÁO CÁO"
                : "Tiếp tục →";

    }

}


/* =========================================================
   VALIDATION
========================================================= */

function validateCurrentStep() {

    /* =========================
       BƯỚC 1
    ========================== */

    if (currentStep === 1) {

        const age =
            Number(
                el("age").value
            );

        const sex =
            el("sex").value;

        const height =
            Number(
                el("height").value
            );

        const weight =
            Number(
                el("weight").value
            );


        if (!age) {

            showMessage(
                "Hãy nhập tuổi."
            );

            return false;

        }


        if (
            age < 18 ||
            age > 64
        ) {

            showMessage(
                "Phiên bản hiện tại áp dụng cho người từ 18 đến 64 tuổi."
            );

            return false;

        }


        if (!sex) {

            showMessage(
                "Hãy chọn giới tính sinh học."
            );

            return false;

        }


        if (
            !height ||
            height < 120 ||
            height > 230
        ) {

            showMessage(
                "Hãy nhập chiều cao hợp lệ."
            );

            return false;

        }


        if (
            !weight ||
            weight < 30 ||
            weight > 250
        ) {

            showMessage(
                "Hãy nhập cân nặng hợp lệ."
            );

            return false;

        }

    }


    /* =========================
       BƯỚC 3
    ========================== */

    if (currentStep === 3) {

        if (
            !el(
                "jobActivity"
            ).value
        ) {

            showMessage(
                "Hãy chọn tính chất công việc."
            );

            return false;

        }


        if (
            el(
                "steps"
            ).value === ""
        ) {

            showMessage(
                "Hãy nhập số bước trung bình mỗi ngày."
            );

            return false;

        }


        if (
            el(
                "sittingHours"
            ).value === ""
        ) {

            showMessage(
                "Hãy nhập thời gian ngồi trung bình mỗi ngày."
            );

            return false;

        }

    }


    /* =========================
       BƯỚC 4
    ========================== */

    if (
        currentStep === 4 &&
        !getRadioValue(
            "goal"
        )
    ) {

        showMessage(
            "Hãy chọn mục tiêu chính."
        );

        return false;

    }


    /* =========================
       BƯỚC 5
    ========================== */

    if (currentStep === 5) {

        if (
            !el(
                "experience"
            ).value
        ) {

            showMessage(
                "Hãy chọn kinh nghiệm tập luyện."
            );

            return false;

        }


        if (
            getEquipment().length === 0
        ) {

            showMessage(
                "Hãy chọn ít nhất một loại dụng cụ."
            );

            return false;

        }

    }


    /* =========================
       BƯỚC 7
    ========================== */

    if (currentStep === 7) {

        const sleepHours =
            Number(
                el(
                    "sleepHours"
                ).value
            );


        if (
            !sleepHours ||
            sleepHours < 3 ||
            sleepHours > 12
        ) {

            showMessage(
                "Hãy nhập số giờ ngủ hợp lệ."
            );

            return false;

        }


        if (
            !el(
                "energy"
            ).value
        ) {

            showMessage(
                "Hãy chọn mức năng lượng."
            );

            return false;

        }


        if (
            !el(
                "stress"
            ).value
        ) {

            showMessage(
                "Hãy chọn mức stress."
            );

            return false;

        }


        if (
            !el(
                "fatigue"
            ).value
        ) {

            showMessage(
                "Hãy chọn mức mệt hiện tại."
            );

            return false;

        }

    }


    return true;

}


/* =========================================================
   NEXT / BACK
========================================================= */

function nextStep() {

    if (
        !validateCurrentStep()
    ) {
        return;
    }


    if (
        currentStep <
        totalSteps
    ) {

        currentStep++;

        showStep();

        window.scrollTo({
            top: 150,
            behavior: "smooth"
        });

        return;

    }


    runFitnessAnalysis();

}


function prevStep() {

    if (
        currentStep > 1
    ) {

        currentStep--;

        showStep();

        window.scrollTo({
            top: 150,
            behavior: "smooth"
        });

    }

}


/* =========================================================
   INJURY UI
========================================================= */

document
    .querySelectorAll(
        'input[name="injury"]'
    )
    .forEach(
        input => {

            input.addEventListener(
                "change",
                () => {

                    const wrap =
                        el(
                            "injuryAreaWrap"
                        );


                    if (!wrap) {
                        return;
                    }


                    wrap.style.display =
                        getRadioValue(
                            "injury"
                        ) === "yes"

                            ? "block"
                            : "none";

                }
            );

        }
    );


/* =========================================================
   PROFILE
========================================================= */

function collectFitnessProfile() {

    return {

        age:
            Number(
                el("age").value
            ),

        sex:
            el("sex").value,

        height:
            Number(
                el("height").value
            ),

        weight:
            Number(
                el("weight").value
            ),

        waist:
            el("waist").value

                ? Number(
                    el("waist").value
                )

                : null,


        safety: {

            chest:
                getRadioValue(
                    "chest"
                ),

            faint:
                getRadioValue(
                    "faint"
                ),

            breath:
                getRadioValue(
                    "breath"
                ),

            injury:
                getRadioValue(
                    "injury"
                ),

            injuryArea:
                el(
                    "injuryArea"
                ).value,

            medical:
                getRadioValue(
                    "medical"
                ),

            surgery:
                getRadioValue(
                    "surgery"
                ),

            pregnancy:
                getRadioValue(
                    "pregnancy"
                ),

            medicalNote:
                el(
                    "medicalNote"
                )
                .value
                .trim()

        },


        activity: {

            jobActivity:
                el(
                    "jobActivity"
                ).value,

            steps:
                Number(
                    el(
                        "steps"
                    ).value
                ),

            sittingHours:
                Number(
                    el(
                        "sittingHours"
                    ).value
                ),

            currentTrainingDays:
                Number(
                    el(
                        "currentTrainingDays"
                    ).value
                ),

            dailyActivity:
                el(
                    "dailyActivity"
                ).value,

            activityNote:
                el(
                    "activityNote"
                )
                .value
                .trim()

        },


        goal: {

            primary:
                getRadioValue(
                    "goal"
                ),

            note:
                el(
                    "goalNote"
                )
                .value
                .trim()

        },


        training: {

            experience:
                el(
                    "experience"
                ).value,

            days:
                Number(
                    el(
                        "days"
                    ).value
                ),

            duration:
                Number(
                    el(
                        "duration"
                    ).value
                ),

            location:
                el(
                    "locationSel"
                ).value,

            trainingTime:
                el(
                    "trainingTime"
                ).value,

            equipment:
                getEquipment(),

            trainingLimit:
                el(
                    "trainingLimit"
                )
                .value
                .trim()

        },


        nutrition: {

            meals:
                Number(
                    el(
                        "meals"
                    ).value
                ),

            dietType:
                el(
                    "dietType"
                ).value,

            allergies:
                el(
                    "allergies"
                )
                .value
                .trim(),

            foodLikes:
                el(
                    "foodLikes"
                )
                .value
                .trim(),

            foodDislikes:
                el(
                    "foodDislikes"
                )
                .value
                .trim(),

            foodRestriction:
                el(
                    "foodRestriction"
                )
                .value
                .trim(),

            budget:
                el(
                    "budget"
                ).value,

            cooking:
                el(
                    "cooking"
                ).value,

            eatingOut:
                el(
                    "eatingOut"
                ).value,

            prepTime:
                el(
                    "prepTime"
                ).value

        },


        recovery: {

            sleepHours:
                Number(
                    el(
                        "sleepHours"
                    ).value
                ),

            energy:
                Number(
                    el(
                        "energy"
                    ).value
                ),

            bedTime:
                el(
                    "bedTime"
                ).value,

            wakeTime:
                el(
                    "wakeTime"
                ).value,

            stress:
                Number(
                    el(
                        "stress"
                    ).value
                ),

            fatigue:
                Number(
                    el(
                        "fatigue"
                    ).value
                ),

            caffeine:
                el(
                    "caffeine"
                ).value,

            recoveryNote:
                el(
                    "recoveryNote"
                )
                .value
                .trim()

        },


        createdAt:
            new Date()
                .toISOString(),

        version:
            "SportHub Fitness Engine v1.0"

    };

}


/* =========================================================
   GOAL NAME
========================================================= */

function getGoalName(goal) {

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


    return names[goal]
        ||
        "Chưa xác định";

}


/* =========================================================
   ENGINE + STORAGE

   Chạy xong toàn bộ engine trước khi ghi kết quả mới.
   Nếu lỗi, giữ nguyên dữ liệu Fitness Check cũ.
========================================================= */

function saveFitnessResults(
    profile,
    healthResult,
    workoutResult,
    nutritionResult
) {

    const keys = {

        profile:
            "sporthub_fitness_profile",

        health:
            "sporthub_fitness_analysis",

        workout:
            "sporthub_workout_plan",

        nutrition:
            "sporthub_nutrition_plan"

    };


    const previous = {

        profile:
            localStorage.getItem(
                keys.profile
            ),

        health:
            localStorage.getItem(
                keys.health
            ),

        workout:
            localStorage.getItem(
                keys.workout
            ),

        nutrition:
            localStorage.getItem(
                keys.nutrition
            )

    };


    try {

        localStorage.setItem(
            keys.profile,
            JSON.stringify(
                profile
            )
        );


        localStorage.setItem(
            keys.health,
            JSON.stringify(
                healthResult
            )
        );


        localStorage.setItem(
            keys.workout,
            JSON.stringify(
                workoutResult
            )
        );


        localStorage.setItem(
            keys.nutrition,
            JSON.stringify(
                nutritionResult
            )
        );

    }

    catch (error) {

        Object
            .entries(
                keys
            )
            .forEach(
                ([name, key]) => {

                    const oldValue =
                        previous[name];


                    if (
                        oldValue === null
                    ) {

                        localStorage
                            .removeItem(
                                key
                            );

                    }

                    else {

                        localStorage
                            .setItem(
                                key,
                                oldValue
                            );

                    }

                }
            );


        throw error;

    }

}


function notifyPersonalPlanUpdate() {

    try {

        window.dispatchEvent(

            new CustomEvent(
                "sporthub:personal-plan-update",
                {
                    detail: {
                        source:
                            "fitness-check"
                    }
                }
            )

        );

    }

    catch (error) {

        /*
            Không chặn kết quả
            chỉ vì event không tạo được.
        */

    }

}


function runFitnessAnalysis() {

    const profile =
        collectFitnessProfile();


    if (
        !window
            .SportHubHealthEngine
    ) {

        showMessage(
            "Không tìm thấy health-engine.js."
        );

        return;

    }


    if (
        !window
            .SportHubWorkoutEngine
    ) {

        showMessage(
            "Không tìm thấy workout-engine.js."
        );

        return;

    }


    if (
        !window
            .SportHubNutritionEngine
    ) {

        showMessage(
            "Không tìm thấy nutrition-engine.js."
        );

        return;

    }


    let healthResult =
        null;

    let workoutResult =
        null;

    let nutritionResult =
        null;


    try {

        healthResult =
            window
                .SportHubHealthEngine
                .run(
                    profile
                );


        if (
            !healthResult ||
            healthResult.success !== true
        ) {

            renderFitnessReport(
                profile,
                healthResult,
                null,
                null
            );

            return;

        }


        workoutResult =
            window
                .SportHubWorkoutEngine
                .run(
                    profile,
                    healthResult
                );


        if (
            !workoutResult
        ) {

            throw new Error(
                "Workout Engine không trả về kết quả."
            );

        }


        nutritionResult =
            window
                .SportHubNutritionEngine
                .run(
                    profile,
                    healthResult
                );


        if (
            !nutritionResult
        ) {

            throw new Error(
                "Nutrition Engine không trả về kết quả."
            );

        }


        saveFitnessResults(
            profile,
            healthResult,
            workoutResult,
            nutritionResult
        );


        notifyPersonalPlanUpdate();

    }

    catch (error) {

        console.error(
            "SPORTHUB Fitness Check error:",
            error
        );


        showMessage(
            "Không thể hoàn tất Fitness Check. Kết quả trước đó vẫn được giữ nguyên."
        );


        return;

    }


    renderFitnessReport(
        profile,
        healthResult,
        workoutResult,
        nutritionResult
    );

}


/* =========================================================
   SAFETY
========================================================= */

function buildSafetyHTML(
    safety
) {

    if (!safety) {
        return "";
    }


    if (
        safety.level === "stop"
    ) {

        const reasons =
            Array.isArray(
                safety.reasons
            )

                ? safety.reasons
                : [];


        return `

            <div class="safety-box stop">

                <h3>
                    Cần đánh giá chuyên môn trước khi tiếp tục
                </h3>

                <p>
                    Hệ thống ghi nhận một hoặc nhiều yếu tố
                    cần thận trọng:
                </p>

                ${
                    reasons.length

                        ? `
                            <ul
                                style="
                                    margin:12px 0 0 20px;
                                "
                            >
                                ${
                                    reasons
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

                <p
                    style="
                        margin-top:14px;
                    "
                >
                    ${
                        escapeHTML(
                            safety.message
                        )
                    }
                </p>

            </div>

        `;

    }


    if (
        safety.level === "caution"
    ) {

        return `

            <div class="safety-box caution">

                <h3>
                    Có yếu tố cần điều chỉnh
                </h3>

                <p>
                    ${
                        escapeHTML(
                            safety.message
                        )
                    }
                </p>

            </div>

        `;

    }


    return `

        <div class="safety-box safe">

            <h3>
                Safety Check ban đầu
            </h3>

            <p>
                ${
                    escapeHTML(
                        safety.message
                    )
                }
            </p>

        </div>

    `;

}


/* =========================================================
   RECHECK
========================================================= */

function startFitnessRecheck() {

    const confirmed =
        window.confirm(
            "Bạn muốn thực hiện Fitness Check mới? Kết quả mới có thể cập nhật kế hoạch sức khỏe, tập luyện và dinh dưỡng hiện tại."
        );


    if (!confirmed) {
        return;
    }


    currentStep = 1;

    showStep();


    const resultSection =
        el(
            "fitnessResult"
        );


    const resultBox =
        el(
            "fitnessResultContent"
        );


    if (
        resultSection
    ) {

        resultSection
            .classList
            .remove(
                "active"
            );

    }


    if (
        resultBox
    ) {

        resultBox.innerHTML =
            "";

    }


    const formCard =
        document.querySelector(
            ".fitness-card"
        );


    if (
        formCard
    ) {

        formCard.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });

    }

}


/* =========================================================
   REPORT
========================================================= */

function renderFitnessReport(
    profile,
    healthResult,
    workoutResult,
    nutritionResult
) {

    const resultBox =
        el(
            "fitnessResultContent"
        );


    const resultSection =
        el(
            "fitnessResult"
        );


    if (
        !resultBox ||
        !resultSection
    ) {

        return;

    }


    if (
        !healthResult ||
        healthResult.success !== true
    ) {

        resultBox.innerHTML = `

            <div class="safety-box stop">

                <h3>
                    Không thể tạo báo cáo
                </h3>

                <p>
                    ${
                        escapeHTML(

                            healthResult &&
                            healthResult.error

                                ? healthResult.error

                                : "Không đủ dữ liệu để phân tích."

                        )
                    }
                </p>

            </div>

        `;


        resultSection
            .classList
            .add(
                "active"
            );


        resultSection
            .scrollIntoView({
                behavior:
                    "smooth"
            });


        return;

    }


    const safety =
        healthResult.safety;


    const bmi =
        healthResult.body

            ? healthResult
                .body
                .bmi

            : null;


    const rmr =
        healthResult.body

            ? healthResult
                .body
                .rmr

            : null;


    const activityFactor =
        healthResult.energy

            ? healthResult
                .energy
                .activityFactor

            : null;


    const tdee =
        healthResult.energy

            ? healthResult
                .energy
                .tdee

            : null;


    const calorie =
        healthResult.energy

            ? healthResult
                .energy
                .calorieTarget

            : null;


    const protein =
        healthResult.nutrition

            ? healthResult
                .nutrition
                .protein

            : null;


    const fat =
        healthResult.nutrition

            ? healthResult
                .nutrition
                .fat

            : null;


    const carbs =
        healthResult.nutrition

            ? healthResult
                .nutrition
                .carbs

            : null;


    const recovery =
        healthResult.recovery;


    const workoutStatus =

        workoutResult &&
        workoutResult.blocked === true

            ? "Đang giới hạn bởi Safety Check"

            : workoutResult &&
              workoutResult.success === true

                ? "Đã tạo kế hoạch tập luyện"

                : "Chưa thể tạo kế hoạch tập luyện";


    const nutritionStatus =

        nutritionResult &&
        nutritionResult.blocked === true

            ? "Đang giới hạn bởi Safety Check"

            : nutritionResult &&
              nutritionResult.success === true

                ? "Đã tạo kế hoạch dinh dưỡng"

                : "Chưa thể tạo kế hoạch dinh dưỡng";


    resultBox.innerHTML = `

        <!-- =============================================
             TỔNG QUAN
        ============================================== -->

        <div class="section-heading">

            <div>

                <span class="eyebrow">
                    PERSONAL HEALTH & FITNESS REPORT
                </span>

                <h2>
                    Tổng quan Fitness Check
                </h2>

                <p>
                    SPORTHUB đã phân tích dữ liệu bạn cung cấp
                    và tạo bộ kế hoạch cá nhân tương ứng.
                </p>

            </div>

        </div>


        <div class="result-grid">


            <div class="result-stat">

                <span>
                    Tuổi
                </span>

                <strong>
                    ${
                        escapeHTML(
                            profile.age
                        )
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Chiều cao
                </span>

                <strong>
                    ${
                        escapeHTML(
                            profile.height
                        )
                    } cm
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Cân nặng
                </span>

                <strong>
                    ${
                        escapeHTML(
                            profile.weight
                        )
                    } kg
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Mục tiêu
                </span>

                <strong>
                    ${
                        escapeHTML(

                            getGoalName(

                                profile &&
                                profile.goal

                                    ? profile
                                        .goal
                                        .primary

                                    : ""

                            )

                        )
                    }
                </strong>

            </div>


        </div>


        ${buildSafetyHTML(safety)}


        <!-- =============================================
             THỂ TRẠNG
        ============================================== -->

        <div class="fitness-result-group">

            <span class="eyebrow">
                PHÂN TÍCH THỂ TRẠNG
            </span>

            <h2>
                Các chỉ số nền tảng
            </h2>

        </div>


        <div class="result-grid">


            <div class="result-stat">

                <span>
                    BMI
                </span>

                <strong>
                    ${
                        bmi

                            ? escapeHTML(
                                bmi.value
                            )

                            : "—"
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    RMR ước tính
                </span>

                <strong>
                    ${
                        rmr

                            ? `${
                                escapeHTML(
                                    rmr.value
                                )
                            } kcal`

                            : "—"
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Hệ số vận động
                </span>

                <strong>
                    ${
                        activityFactor

                            ? escapeHTML(
                                activityFactor.value
                            )

                            : "—"
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    TDEE ước tính
                </span>

                <strong>
                    ${
                        tdee

                            ? `${
                                escapeHTML(
                                    tdee.min
                                )
                            }–${
                                escapeHTML(
                                    tdee.max
                                )
                            } kcal`

                            : "—"
                    }
                </strong>

            </div>


        </div>


        <div class="safety-box">

            <h3>
                Ý nghĩa của BMI
            </h3>

            <p>
                ${
                    bmi

                        ? escapeHTML(
                            bmi.note
                        )

                        : "Chưa đủ dữ liệu."
                }
            </p>

        </div>


        <div class="safety-box">

            <h3>
                RMR và TDEE
            </h3>

            <p>
                ${
                    rmr

                        ? escapeHTML(
                            rmr.note
                        )

                        : ""
                }
            </p>

            <p
                style="
                    margin-top:10px;
                "
            >
                ${
                    tdee

                        ? escapeHTML(
                            tdee.note
                        )

                        : ""
                }
            </p>

        </div>


        <!-- =============================================
             NĂNG LƯỢNG
        ============================================== -->

        <div class="fitness-result-group">

            <span class="eyebrow">
                MỤC TIÊU NĂNG LƯỢNG
            </span>

            <h2>
                Mức tham khảo khởi đầu
            </h2>

        </div>


        <div class="result-grid">


            <div class="result-stat">

                <span>
                    Calorie
                </span>

                <strong>
                    ${
                        calorie

                            ? `${
                                escapeHTML(
                                    calorie.min
                                )
                            }–${
                                escapeHTML(
                                    calorie.max
                                )
                            }`

                            : "—"
                    }
                </strong>

                <span>
                    kcal/ngày
                </span>

            </div>


            <div class="result-stat">

                <span>
                    Protein
                </span>

                <strong>
                    ${
                        protein

                            ? `${
                                escapeHTML(
                                    protein.min
                                )
                            }–${
                                escapeHTML(
                                    protein.max
                                )
                            }`

                            : "—"
                    }
                </strong>

                <span>
                    g/ngày
                </span>

            </div>


            <div class="result-stat">

                <span>
                    Chất béo
                </span>

                <strong>
                    ${
                        fat

                            ? `${
                                escapeHTML(
                                    fat.min
                                )
                            }–${
                                escapeHTML(
                                    fat.max
                                )
                            }`

                            : "—"
                    }
                </strong>

                <span>
                    g/ngày
                </span>

            </div>


            <div class="result-stat">

                <span>
                    Carbohydrate
                </span>

                <strong>
                    ${
                        carbs

                            ? escapeHTML(
                                carbs.value
                            )

                            : "—"
                    }
                </strong>

                <span>
                    g/ngày
                </span>

            </div>


        </div>


        <div class="safety-box">

            <h3>
                Vì sao chọn mức này?
            </h3>

            <p>
                ${
                    calorie

                        ? escapeHTML(
                            calorie.strategy
                        )

                        : ""
                }
            </p>

            <p
                style="
                    margin-top:10px;
                "
            >
                ${
                    calorie

                        ? escapeHTML(
                            calorie.note
                        )

                        : ""
                }
            </p>

        </div>


        <!-- =============================================
             PHỤC HỒI
        ============================================== -->

        <div class="fitness-result-group">

            <span class="eyebrow">
                PHỤC HỒI
            </span>

            <h2>
                Giấc ngủ và mức sẵn sàng
            </h2>

        </div>


        <div class="result-grid">


            <div class="result-stat">

                <span>
                    Giấc ngủ
                </span>

                <strong>
                    ${
                        recovery

                            ? `${
                                escapeHTML(
                                    recovery.sleepHours
                                )
                            } giờ`

                            : "—"
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Năng lượng
                </span>

                <strong>
                    ${
                        recovery

                            ? `${
                                escapeHTML(
                                    recovery.energy
                                )
                            }/10`

                            : "—"
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Stress
                </span>

                <strong>
                    ${
                        recovery

                            ? `${
                                escapeHTML(
                                    recovery.stress
                                )
                            }/10`

                            : "—"
                    }
                </strong>

            </div>


            <div class="result-stat">

                <span>
                    Mức mệt
                </span>

                <strong>
                    ${
                        recovery

                            ? `${
                                escapeHTML(
                                    recovery.fatigue
                                )
                            }/10`

                            : "—"
                    }
                </strong>

            </div>


        </div>


        <div class="safety-box">

            <h3>
                Ưu tiên phục hồi
            </h3>

            <p>
                ${
                    recovery

                        ? escapeHTML(
                            recovery.sleepAction
                        )

                        : ""
                }
            </p>

        </div>


        <!-- =============================================
             TRẠNG THÁI KẾ HOẠCH
        ============================================== -->

        <div
            class="safety-box"
            style="
                margin-top:40px;
            "
        >

            <h3>
                Kế hoạch cá nhân đã được xử lý
            </h3>


            <p>
                Tập luyện:

                <strong>
                    ${
                        escapeHTML(
                            workoutStatus
                        )
                    }
                </strong>
            </p>


            <p
                style="
                    margin-top:8px;
                "
            >
                Dinh dưỡng:

                <strong>
                    ${
                        escapeHTML(
                            nutritionStatus
                        )
                    }
                </strong>
            </p>


            <p
                style="
                    margin-top:10px;
                "
            >
                Mở Kế hoạch cá nhân để xem chi tiết
                sức khỏe, lịch tập và dinh dưỡng.
            </p>

        </div>


        <!-- =============================================
             ACTIONS
        ============================================== -->

        <div class="fitness-result-actions">


            <a
                class="fitness-result-primary"
                href="./"
            >
                XEM KẾ HOẠCH CÁ NHÂN
            </a>


            <button
                id="fitnessRecheckBtn"
                class="fitness-result-secondary"
                type="button"
            >
                KIỂM TRA LẠI
            </button>


        </div>

    `;


    const recheckButton =
        el(
            "fitnessRecheckBtn"
        );


    if (
        recheckButton
    ) {

        recheckButton.addEventListener(
            "click",
            startFitnessRecheck
        );

    }


    resultSection
        .classList
        .add(
            "active"
        );


    resultSection
        .scrollIntoView({
            behavior:
                "smooth"
        });

}


/* =========================================================
   INIT
========================================================= */

showStep();