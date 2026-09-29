/* =========================================================
   SPORTHUB NUTRITION PLAN PAGE
   Version 1.1

   Dùng cho:
   ke-hoach-dinh-duong.html

   Nhiệm vụ:
   - Đọc profile từ localStorage
   - Đọc Health Analysis từ localStorage
   - Đọc Nutrition Plan từ localStorage
   - Render chiến lược dinh dưỡng
   - Render macro
   - Render thực đơn 7 ngày
   - Render từng bữa ăn
   - Render cảnh báo dị ứng / hạn chế
   - Render hướng dẫn ăn ngoài
   - Render danh sách mua thực phẩm

   Không chạy lại:
   - Health Engine
   - Nutrition Engine
========================================================= */

window.SportHubNutritionPlanPage = (() => {

    "use strict";


    /* =====================================================
       1. STORAGE
    ====================================================== */

    const STORAGE = {

        profile:
            "sporthub_fitness_profile",

        health:
            "sporthub_fitness_analysis",

        nutrition:
            "sporthub_nutrition_plan"

    };


    /* =====================================================
       2. DOM
    ====================================================== */

    let root =
        null;


    /* =====================================================
       3. SAFE JSON
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
        busy
    ) {

        if (!root) {

            return;

        }


        root.setAttribute(
            "aria-busy",
            busy
                ? "true"
                : "false"
        );

    }


    function cleanText(
        value
    ) {

        return String(
            value ?? ""
        )
            .trim();

    }


    function hasText(
        value
    ) {

        return cleanText(
            value
        ).length > 0;

    }


    function safeArray(
        value
    ) {

        return Array.isArray(
            value
        )
            ? value
            : [];

    }


    function formatValue(
        value,
        fallback = "—"
    ) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return fallback;

        }


        return escapeHTML(
            value
        );

    }


    function formatAmount(
        amount,
        unit
    ) {

        const amountText =
            amount === null ||
            amount === undefined ||
            amount === ""

                ? ""

                : escapeHTML(
                    amount
                );


        const unitText =
            hasText(
                unit
            )

                ? escapeHTML(
                    unit
                )

                : "";


        return [
            amountText,
            unitText
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            );

    }


/* =====================================================
   6. DATA GETTERS

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


function getNutrition() {

    if (
        window
            .SportHubPersonalPlan
            ?.getNutrition
    ) {

        return window
            .SportHubPersonalPlan
            .getNutrition();

    }


    return readStorage(
        STORAGE.nutrition
    );

}


    /* =====================================================
       7. STRATEGY HELPERS
    ====================================================== */

    function getStrategy(
        nutrition
    ) {

        return nutrition
            ?.strategy
            || {};

    }


    function getPlan(
        nutrition
    ) {

        return safeArray(
            nutrition
                ?.plan
        );

    }


    function getEatingOut(
        nutrition
    ) {

        return safeArray(
            nutrition
                ?.eatingOut
        );

    }


    function getShoppingList(
        nutrition
    ) {

        return safeArray(
            nutrition
                ?.shoppingList
        );

    }


    /* =====================================================
       8. SAFETY
    ====================================================== */

    function buildSafetyHTML(
        health,
        nutrition
    ) {

        const safety =
            health
                ?.safety;


        if (
            nutrition
                ?.blocked === true
        ) {

            return `
                <section class="nutrition-plan-notice caution">

                    <h2>
                        Kế hoạch dinh dưỡng chưa được tự động tạo
                    </h2>

                    <p>
                        ${
                            escapeHTML(
                                nutrition.reason
                                ||
                                "Dữ liệu hiện tại chưa cho phép tạo kế hoạch dinh dưỡng tự động."
                            )
                        }
                    </p>

                </section>
            `;

        }


        if (!safety) {

            return "";

        }


        if (
            safety.level ===
            "stop"
        ) {

            return `
                <section class="nutrition-plan-notice caution">

                    <h2>
                        Lưu ý từ Safety Check
                    </h2>

                    <p>
                        ${
                            escapeHTML(
                                safety.message
                                ||
                                "Có thông tin sức khỏe cần được xem xét thận trọng."
                            )
                        }
                    </p>

                </section>
            `;

        }


        if (
            safety.level ===
            "caution"
        ) {

            return `
                <section class="nutrition-plan-notice caution">

                    <h2>
                        Có yếu tố cần lưu ý
                    </h2>

                    <p>
                        ${
                            escapeHTML(
                                safety.message
                                ||
                                "Hãy theo dõi phản ứng thực tế và điều chỉnh kế hoạch khi cần."
                            )
                        }
                    </p>

                </section>
            `;

        }


        return "";

    }


    /* =====================================================
       9. ALLERGY / RESTRICTION
    ====================================================== */

    function buildRestrictionHTML(
        profile
    ) {

        const nutrition =
            profile
                ?.nutrition
                || {};


        const allergies =
            cleanText(
                nutrition.allergies
            );


        const restriction =
            cleanText(
                nutrition.foodRestriction
            );


        const dislikes =
            cleanText(
                nutrition.foodDislikes
            );


        if (
            !allergies &&
            !restriction &&
            !dislikes
        ) {

            return "";

        }


        const items =
            [];


        if (allergies) {

            items.push(`
                <p>
                    <strong>
                        Dị ứng / thực phẩm cần tránh:
                    </strong>

                    ${escapeHTML(allergies)}
                </p>
            `);

        }


        if (restriction) {

            items.push(`
                <p>
                    <strong>
                        Hạn chế ăn uống:
                    </strong>

                    ${escapeHTML(restriction)}
                </p>
            `);

        }


        if (dislikes) {

            items.push(`
                <p>
                    <strong>
                        Thực phẩm không thích:
                    </strong>

                    ${escapeHTML(dislikes)}
                </p>
            `);

        }


        return `
            <section class="nutrition-plan-notice caution">

                <h2>
                    Kiểm tra thực phẩm trước khi áp dụng
                </h2>

                ${items.join("")}

                <p>
                    Bộ lọc tự động chỉ hỗ trợ kế hoạch tham khảo.
                    Hãy kiểm tra lại thành phần thực tế của từng món,
                    đặc biệt khi có dị ứng hoặc hạn chế ăn uống.
                </p>

            </section>
        `;

    }


    /* =====================================================
       10. SUMMARY
    ====================================================== */

    function buildSummaryHTML(
        nutrition
    ) {

        const strategy =
            getStrategy(
                nutrition
            );


        return `
            <section
                class="nutrition-summary"
                aria-labelledby="nutritionSummaryTitle"
            >

                <div class="nutrition-summary-head">

                    <div>

                        <span class="eyebrow">
                            TỔNG QUAN
                        </span>

                        <h2 id="nutritionSummaryTitle">
                            Mục tiêu dinh dưỡng
                        </h2>

                    </div>

                </div>


                <div class="nutrition-summary-grid">


                    <div class="nutrition-summary-card">

                        <span>
                            Năng lượng
                        </span>

                        <strong>
                            ${
                                formatValue(
                                    strategy.calorieRange
                                )
                            }
                        </strong>

                    </div>


                    <div class="nutrition-summary-card">

                        <span>
                            Protein
                        </span>

                        <strong>
                            ${
                                formatValue(
                                    strategy.proteinRange
                                )
                            }
                        </strong>

                    </div>


                    <div class="nutrition-summary-card">

                        <span>
                            Chất béo
                        </span>

                        <strong>
                            ${
                                formatValue(
                                    strategy.fatRange
                                )
                            }
                        </strong>

                    </div>


                    <div class="nutrition-summary-card">

                        <span>
                            Carbohydrate
                        </span>

                        <strong>
                            ${
                                formatValue(
                                    strategy.carbReference
                                )
                            }
                        </strong>

                    </div>


                </div>

            </section>
        `;

    }


    /* =====================================================
       11. STRATEGY
    ====================================================== */

    function buildStrategyHTML(
        nutrition
    ) {

        const strategy =
            getStrategy(
                nutrition
            );


        const explanation =
            cleanText(
                strategy.explanation
            );


        const note =
            cleanText(
                strategy.note
            );


        if (
            !explanation &&
            !note
        ) {

            return "";

        }


        return `
            <section class="nutrition-strategy">

                <span class="eyebrow">
                    CHIẾN LƯỢC
                </span>

                <h2>
                    Vì sao chọn mức này?
                </h2>

                ${
                    explanation

                        ? `
                            <p>
                                ${escapeHTML(explanation)}
                            </p>
                        `

                        : ""
                }

                ${
                    note

                        ? `
                            <p>
                                ${escapeHTML(note)}
                            </p>
                        `

                        : ""
                }

            </section>
        `;

    }


    /* =====================================================
       12. MEAL ITEM
    ====================================================== */

    function buildMealItemHTML(
        item
    ) {

        if (!item) {

            return "";

        }


        const amount =
            formatAmount(
                item.amount,
                item.unit
            );


        const itemLabel =
            [
                escapeHTML(
                    item.name
                    ||
                    "Thực phẩm"
                ),

                amount
            ]
                .filter(
                    Boolean
                )
                .join(
                    " — "
                );


        const kcal =
            item.kcal !== null &&
            item.kcal !== undefined

                ? `${escapeHTML(item.kcal)} kcal`

                : "";


        return `
            <div class="nutrition-meal-item">

                <span>
                    ${itemLabel}
                </span>

                <span>
                    ${kcal}
                </span>

            </div>
        `;

    }


    /* =====================================================
       13. MEAL
    ====================================================== */

    function buildMealHTML(
        meal
    ) {

        if (!meal) {

            return "";

        }


        const items =
            safeArray(
                meal.items
            );


        const totals =
            meal.totals
            || {};


        const reason =
            cleanText(
                meal.reason
            );


        const replacement =
            cleanText(
                meal.replacement
            );


        return `
            <article class="nutrition-meal">

                <h3>
                    ${
                        escapeHTML(
                            meal.name
                            ||
                            "Bữa ăn"
                        )
                    }
                </h3>


                <div>

                    ${
                        items.length

                            ? items
                                .map(
                                    buildMealItemHTML
                                )
                                .join("")

                            : `
                                <p class="nutrition-meal-note">
                                    Chưa có chi tiết thực phẩm cho bữa này.
                                </p>
                            `
                    }

                </div>


                <div class="nutrition-meal-total">

                    ${
                        totals.kcal !== undefined
                            ? `${escapeHTML(totals.kcal)} kcal`
                            : "—"
                    }

                    ${
                        totals.protein !== undefined
                            ? ` · P ${escapeHTML(totals.protein)} g`
                            : ""
                    }

                    ${
                        totals.carbs !== undefined
                            ? ` · C ${escapeHTML(totals.carbs)} g`
                            : ""
                    }

                    ${
                        totals.fat !== undefined
                            ? ` · F ${escapeHTML(totals.fat)} g`
                            : ""
                    }

                </div>


                ${
                    reason

                        ? `
                            <p class="nutrition-meal-note">

                                <strong>
                                    Vì sao chọn:
                                </strong>

                                ${escapeHTML(reason)}

                            </p>
                        `

                        : ""
                }


                ${
                    replacement

                        ? `
                            <p class="nutrition-meal-note">

                                <strong>
                                    Có thể thay:
                                </strong>

                                ${escapeHTML(replacement)}

                            </p>
                        `

                        : ""
                }


            </article>
        `;

    }


    /* =====================================================
       14. DAY
    ====================================================== */

    function buildDayHTML(
        day,
        index
    ) {

        if (!day) {

            return "";

        }


        const meals =
            safeArray(
                day.meals
            );


        const totals =
            day.totals
            || {};


        const dayName =
            day.day
            ||
            `Ngày ${index + 1}`;


        const kcal =
            totals.kcal !== undefined

                ? `${escapeHTML(totals.kcal)} kcal`

                : "";


        return `
            <details
                class="nutrition-day"
                ${index === 0 ? "open" : ""}
            >

                <summary>

                    <span>
                        ${escapeHTML(dayName)}
                    </span>

                    <span class="nutrition-day-total">
                        ${kcal}
                    </span>

                </summary>


                <div class="nutrition-day-content">


                    <div class="nutrition-day-macros">

                        ${
                            totals.protein !== undefined

                                ? `
                                    <span>
                                        Protein:
                                        ${escapeHTML(totals.protein)} g
                                    </span>
                                `

                                : ""
                        }


                        ${
                            totals.carbs !== undefined

                                ? `
                                    <span>
                                        Carb:
                                        ${escapeHTML(totals.carbs)} g
                                    </span>
                                `

                                : ""
                        }


                        ${
                            totals.fat !== undefined

                                ? `
                                    <span>
                                        Fat:
                                        ${escapeHTML(totals.fat)} g
                                    </span>
                                `

                                : ""
                        }

                    </div>


                    ${
                        meals.length

                            ? meals
                                .map(
                                    buildMealHTML
                                )
                                .join("")

                            : `
                                <div class="nutrition-plan-notice">

                                    <p>
                                        Chưa có dữ liệu bữa ăn
                                        cho ngày này.
                                    </p>

                                </div>
                            `
                    }


                </div>

            </details>
        `;

    }


    /* =====================================================
       15. WEEK
    ====================================================== */

    function buildWeekHTML(
        nutrition
    ) {

        const plan =
            getPlan(
                nutrition
            );


        if (!plan.length) {

            return `
                <section class="nutrition-week">

                    <div class="nutrition-week-head">

                        <span class="eyebrow">
                            THỰC ĐƠN
                        </span>

                        <h2>
                            Thực đơn 7 ngày
                        </h2>

                    </div>


                    <div class="nutrition-plan-notice">

                        <p>
                            Kế hoạch hiện chưa có dữ liệu
                            thực đơn theo ngày.
                        </p>

                    </div>

                </section>
            `;

        }


        return `
            <section class="nutrition-week">

                <div class="nutrition-week-head">

                    <span class="eyebrow">
                        THỰC ĐƠN
                    </span>

                    <h2>
                        Thực đơn 7 ngày
                    </h2>

                    <p>
                        Mở từng ngày để xem bữa ăn,
                        lượng thực phẩm và macro dự kiến.
                    </p>

                </div>


                <div>

                    ${
                        plan
                            .map(
                                buildDayHTML
                            )
                            .join("")
                    }

                </div>

            </section>
        `;

    }


    /* =====================================================
       16. EATING OUT
    ====================================================== */

    function buildEatingOutHTML(
        nutrition
    ) {

        const items =
            getEatingOut(
                nutrition
            );


        if (!items.length) {

            return "";

        }


        return `
            <section class="nutrition-extra-card">

                <span class="eyebrow">
                    THỰC TẾ
                </span>

                <h2>
                    Khi ăn ngoài
                </h2>

                <ul>

                    ${
                        items
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

            </section>
        `;

    }


    /* =====================================================
       17. PLAN GUIDANCE
    ====================================================== */

    function buildPlanGuideHTML(
        profile
    ) {

        const nutrition =
            profile
                ?.nutrition
                || {};


        const items =
            [];


        if (
            hasText(
                nutrition.foodLikes
            )
        ) {

            items.push(
                `
                    <li>
                        Thực phẩm yêu thích đã khai báo:
                        ${escapeHTML(nutrition.foodLikes)}
                    </li>
                `
            );

        }


        if (
            hasText(
                nutrition.budget
            )
        ) {

            const budgetNames = {

                low:
                    "Tiết kiệm",

                medium:
                    "Trung bình",

                high:
                    "Linh hoạt"

            };


            items.push(
                `
                    <li>
                        Ngân sách:
                        ${
                            escapeHTML(
                                budgetNames[
                                    nutrition.budget
                                ]
                                ||
                                nutrition.budget
                            )
                        }
                    </li>
                `
            );

        }


        if (
            hasText(
                nutrition.cooking
            )
        ) {

            const cookingNames = {

                low:
                    "Ít khi nấu",

                medium:
                    "Có thể nấu cơ bản",

                high:
                    "Nấu ăn thường xuyên"

            };


            items.push(
                `
                    <li>
                        Khả năng nấu ăn:
                        ${
                            escapeHTML(
                                cookingNames[
                                    nutrition.cooking
                                ]
                                ||
                                nutrition.cooking
                            )
                        }
                    </li>
                `
            );

        }


        if (
            hasText(
                nutrition.prepTime
            )
        ) {

            const prepNames = {

                low:
                    "Rất ít thời gian",

                medium:
                    "Khoảng 20–40 phút",

                high:
                    "Có nhiều thời gian"

            };


            items.push(
                `
                    <li>
                        Thời gian chuẩn bị:
                        ${
                            escapeHTML(
                                prepNames[
                                    nutrition.prepTime
                                ]
                                ||
                                nutrition.prepTime
                            )
                        }
                    </li>
                `
            );

        }


        if (!items.length) {

            return "";

        }


        return `
            <section class="nutrition-extra-card">

                <span class="eyebrow">
                    HỒ SƠ
                </span>

                <h2>
                    Điều kiện ăn uống
                </h2>

                <ul>
                    ${items.join("")}
                </ul>

            </section>
        `;

    }


    /* =====================================================
       18. EXTRA GRID
    ====================================================== */

    function buildExtraHTML(
        profile,
        nutrition
    ) {

        const eatingOut =
            buildEatingOutHTML(
                nutrition
            );


        const guide =
            buildPlanGuideHTML(
                profile
            );


        if (
            !eatingOut &&
            !guide
        ) {

            return "";

        }


        return `
            <div class="nutrition-extra-grid">

                ${eatingOut}

                ${guide}

            </div>
        `;

    }


    /* =====================================================
       19. SHOPPING LIST
    ====================================================== */

    function buildShoppingHTML(
        nutrition
    ) {

        const shopping =
            getShoppingList(
                nutrition
            );


        if (!shopping.length) {

            return "";

        }


        return `
            <section class="nutrition-shopping">

                <span class="eyebrow">
                    CHUẨN BỊ
                </span>

                <h2>
                    Danh sách thực phẩm ước tính
                </h2>


                <div class="nutrition-shopping-grid">

                    ${
                        shopping
                            .map(
                                item => {

                                    const amount =
                                        formatAmount(
                                            item?.amount,
                                            item?.unit
                                        );


                                    return `
                                        <div class="nutrition-shopping-item">

                                            <strong>
                                                ${
                                                    escapeHTML(
                                                        item
                                                            ?.name
                                                        ||
                                                        "Thực phẩm"
                                                    )
                                                }
                                            </strong>

                                            <span>
                                                ${amount || "Theo nhu cầu"}
                                            </span>

                                        </div>
                                    `;

                                }
                            )
                            .join("")
                    }

                </div>

            </section>
        `;

    }


    /* =====================================================
       20. NO PLAN
    ====================================================== */

    function renderNoPlan() {

        if (!root) {

            return;

        }


        root.innerHTML = `
            <div class="nutrition-plan-state">

                <span class="eyebrow">
                    CHƯA CÓ DỮ LIỆU
                </span>

                <h2>
                    Chưa có kế hoạch dinh dưỡng
                </h2>

                <p>
                    Hãy hoàn thành Fitness Check để SPORTHUB
                    tạo và lưu kế hoạch dinh dưỡng trước khi
                    mở trang này.
                </p>

                <a
                    class="nutrition-plan-cta"
                    href="health-check.html"
                >
                    Thực hiện Fitness Check
                </a>

            </div>
        `;

    }


    /* =====================================================
       21. INVALID PLAN
    ====================================================== */

    function renderInvalidPlan(
        nutrition
    ) {

        if (!root) {

            return;

        }


        root.innerHTML = `
            <div class="nutrition-plan-state">

                <span class="eyebrow">
                    KẾ HOẠCH CHƯA SẴN SÀNG
                </span>

                <h2>
                    Chưa thể hiển thị kế hoạch
                </h2>

                <p>
                    ${
                        escapeHTML(
                            nutrition
                                ?.error
                            ||
                            "Dữ liệu kế hoạch dinh dưỡng hiện không hợp lệ."
                        )
                    }
                </p>

                <a
                    class="nutrition-plan-cta"
                    href="health-check.html"
                >
                    Tạo lại kế hoạch
                </a>

            </div>
        `;

    }


    /* =====================================================
       22. BLOCKED PLAN
    ====================================================== */

    function renderBlockedPlan(
        nutrition
    ) {

        if (!root) {

            return;

        }


        root.innerHTML = `
            <div class="nutrition-plan-state">

                <span class="eyebrow">
                    SAFETY CHECK
                </span>

                <h2>
                    Chưa tạo kế hoạch tự động
                </h2>

                <p>
                    ${
                        escapeHTML(
                            nutrition
                                ?.reason
                            ||
                            "Safety Check hiện chưa cho phép tạo kế hoạch dinh dưỡng tự động."
                        )
                    }
                </p>

                <a
                    class="nutrition-plan-cta"
                    href="health-check.html"
                >
                    Xem lại Fitness Check
                </a>

            </div>
        `;

    }


    /* =====================================================
       23. MAIN RENDER
    ====================================================== */

    function render() {

        root =
            document.getElementById(
                "nutritionPlanApp"
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


        const nutrition =
            getNutrition();


        /*
            Chưa chạy Fitness Check.
        */

        if (!nutrition) {

            renderNoPlan();

            setBusy(
                false
            );

            return;

        }


        /*
            Engine trả lỗi.
        */

        if (
            nutrition.success ===
            false

            &&

            nutrition.blocked !==
            true
        ) {

            renderInvalidPlan(
                nutrition
            );

            setBusy(
                false
            );

            return;

        }


        /*
            Engine chủ động block.
        */

        if (
            nutrition.blocked ===
            true
        ) {

            renderBlockedPlan(
                nutrition
            );

            setBusy(
                false
            );

            return;

        }


        /*
            Plan không khai báo success=true
            nhưng vẫn có strategy / plan:
            cho phép render để tương thích
            dữ liệu cũ.
        */

        const strategy =
            getStrategy(
                nutrition
            );


        const plan =
            getPlan(
                nutrition
            );


        if (
            nutrition.success !==
            true

            &&

            Object.keys(
                strategy
            ).length === 0

            &&

            plan.length === 0
        ) {

            renderInvalidPlan(
                nutrition
            );

            setBusy(
                false
            );

            return;

        }


        root.innerHTML = `

            ${buildSummaryHTML(
                nutrition
            )}

            ${buildSafetyHTML(
                health,
                nutrition
            )}

            ${buildRestrictionHTML(
                profile
            )}

            ${buildStrategyHTML(
                nutrition
            )}

            ${buildWeekHTML(
                nutrition
            )}

            ${buildExtraHTML(
                profile,
                nutrition
            )}

            ${buildShoppingHTML(
                nutrition
            )}

        `;


        setBusy(
            false
        );

    }


    /* =====================================================
       24. INIT
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
       25. PUBLIC API
    ====================================================== */

    return {

        render,

        refresh:
            render,

        getProfile,

        getHealth,

        getNutrition

    };

})();