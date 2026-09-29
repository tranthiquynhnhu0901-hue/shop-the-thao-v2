/* =========================================================
   SPORTHUB NUTRITION ENGINE
   Version 1.0
   Tất cả kcal và macro đều là ƯỚC TÍNH.
========================================================= */

window.SportHubNutritionEngine = (() => {


    /* =====================================================
       1. FOOD DATABASE
    ====================================================== */

    const FOOD_DB = {

        rice: {
            name: "Cơm trắng chín",
            unit: "g",
            kcal100: 130,
            p100: 2.7,
            c100: 28.2,
            f100: 0.3,
            type: "carb",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        brownRice: {
            name: "Cơm gạo lứt chín",
            unit: "g",
            kcal100: 123,
            p100: 2.7,
            c100: 25.6,
            f100: 1.0,
            type: "carb",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        oats: {
            name: "Yến mạch",
            unit: "g",
            kcal100: 389,
            p100: 16.9,
            c100: 66.3,
            f100: 6.9,
            type: "carb",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        potato: {
            name: "Khoai lang chín",
            unit: "g",
            kcal100: 90,
            p100: 2.0,
            c100: 20.7,
            f100: 0.2,
            type: "carb",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        bread: {
            name: "Bánh mì",
            unit: "g",
            kcal100: 265,
            p100: 9.0,
            c100: 49.0,
            f100: 3.2,
            type: "carb",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        banana: {
            name: "Chuối",
            unit: "g",
            kcal100: 89,
            p100: 1.1,
            c100: 22.8,
            f100: 0.3,
            type: "fruit",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        apple: {
            name: "Táo",
            unit: "g",
            kcal100: 52,
            p100: 0.3,
            c100: 13.8,
            f100: 0.2,
            type: "fruit",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        orange: {
            name: "Cam",
            unit: "g",
            kcal100: 47,
            p100: 0.9,
            c100: 11.8,
            f100: 0.1,
            type: "fruit",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        vegetables: {
            name: "Rau xanh hỗn hợp",
            unit: "g",
            kcal100: 35,
            p100: 2.0,
            c100: 6.5,
            f100: 0.3,
            type: "vegetable",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        chicken: {
            name: "Ức gà chín",
            unit: "g",
            kcal100: 165,
            p100: 31.0,
            c100: 0,
            f100: 3.6,
            type: "protein",
            tags: [
                "normal"
            ]
        },


        leanPork: {
            name: "Thịt heo nạc chín",
            unit: "g",
            kcal100: 190,
            p100: 29.0,
            c100: 0,
            f100: 7.0,
            type: "protein",
            tags: [
                "normal"
            ]
        },


        leanBeef: {
            name: "Thịt bò nạc chín",
            unit: "g",
            kcal100: 210,
            p100: 27.0,
            c100: 0,
            f100: 10.0,
            type: "protein",
            tags: [
                "normal"
            ]
        },


        fish: {
            name: "Cá chín",
            unit: "g",
            kcal100: 170,
            p100: 26.0,
            c100: 0,
            f100: 7.0,
            type: "protein",
            tags: [
                "normal"
            ]
        },


        egg: {
            name: "Trứng gà",
            unit: "g",
            kcal100: 143,
            p100: 12.6,
            c100: 0.7,
            f100: 9.5,
            type: "protein",
            tags: [
                "normal",
                "vegetarian"
            ]
        },


        tofu: {
            name: "Đậu phụ",
            unit: "g",
            kcal100: 80,
            p100: 8.1,
            c100: 1.9,
            f100: 4.8,
            type: "protein",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        soyMilk: {
            name: "Sữa đậu nành không đường",
            unit: "ml",
            kcal100: 45,
            p100: 3.3,
            c100: 3.0,
            f100: 2.0,
            type: "protein",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        yogurt: {
            name: "Sữa chua không đường",
            unit: "g",
            kcal100: 63,
            p100: 5.3,
            c100: 7.0,
            f100: 1.6,
            type: "protein",
            tags: [
                "normal",
                "vegetarian"
            ]
        },


        milk: {
            name: "Sữa tươi ít béo",
            unit: "ml",
            kcal100: 50,
            p100: 3.4,
            c100: 4.8,
            f100: 1.8,
            type: "protein",
            tags: [
                "normal",
                "vegetarian"
            ]
        },


        peanuts: {
            name: "Đậu phộng",
            unit: "g",
            kcal100: 567,
            p100: 25.8,
            c100: 16.1,
            f100: 49.2,
            type: "fat",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        peanutButter: {
            name: "Bơ đậu phộng",
            unit: "g",
            kcal100: 588,
            p100: 25.1,
            c100: 20.0,
            f100: 50.4,
            type: "fat",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        },


        oil: {
            name: "Dầu ăn",
            unit: "g",
            kcal100: 900,
            p100: 0,
            c100: 0,
            f100: 100,
            type: "fat",
            tags: [
                "normal",
                "vegetarian",
                "vegan"
            ]
        }

    };



    /* =====================================================
       2. HELPER
    ====================================================== */

    function round(
        value,
        decimals = 0
    ) {

        const factor =
            Math.pow(
                10,
                decimals
            );

        return Math.round(
            value *
            factor
        ) / factor;

    }



    function normalizeText(
        value
    ) {

        return String(
            value || ""
        )

            .toLowerCase()

            .normalize(
                "NFD"
            )

            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }



    /* =====================================================
       3. TÍNH DINH DƯỠNG THỰC PHẨM
    ====================================================== */

    function nutritionFor(
        key,
        amount
    ) {

        const food =
            FOOD_DB[key];


        if (!food) {

            return null;

        }


        const factor =
            amount / 100;


        return {

            key:
                key,


            name:
                food.name,


            amount:
                amount,


            unit:
                food.unit,


            kcal:
                round(
                    food.kcal100 *
                    factor
                ),


            protein:
                round(
                    food.p100 *
                    factor,
                    1
                ),


            carbs:
                round(
                    food.c100 *
                    factor,
                    1
                ),


            fat:
                round(
                    food.f100 *
                    factor,
                    1
                )

        };

    }



    /* =====================================================
       4. TỔNG DINH DƯỠNG
    ====================================================== */

    function sumItems(
        items
    ) {

        return items.reduce(

            (
                acc,
                item
            ) => {

                acc.kcal +=
                    item.kcal || 0;


                acc.protein +=
                    item.protein || 0;


                acc.carbs +=
                    item.carbs || 0;


                acc.fat +=
                    item.fat || 0;


                return acc;

            },

            {
                kcal: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }

        );

    }



    /* =====================================================
       5. KIỂU ĂN
    ====================================================== */

    function dietAllows(
        key,
        dietType
    ) {

        const food =
            FOOD_DB[key];


        if (!food) {

            return false;

        }


        if (
            dietType ===
            "vegan"
        ) {

            return food.tags
                .includes(
                    "vegan"
                );

        }


        if (
            dietType ===
            "vegetarian"
        ) {

            return (
                food.tags
                    .includes(
                        "vegetarian"
                    )
                ||
                food.tags
                    .includes(
                        "vegan"
                    )
            );

        }


        return true;

    }



    /* =====================================================
       6. LOẠI TRỪ THỰC PHẨM
    ====================================================== */

    function isExcluded(
        key,
        profile
    ) {

        const text =
            normalizeText(

                [

                    profile
                        .nutrition
                        ?.allergies,

                    profile
                        .nutrition
                        ?.foodDislikes,

                    profile
                        .nutrition
                        ?.foodRestriction

                ]

                    .filter(
                        Boolean
                    )

                    .join(
                        " "
                    )

            );


        if (!text) {

            return false;

        }


        const aliases = {

            peanuts: [
                "dau phong",
                "lac"
            ],

            peanutButter: [
                "bo dau phong",
                "bo lac"
            ],

            milk: [
                "sua bo",
                "sua tuoi"
            ],

            yogurt: [
                "sua chua"
            ],

            egg: [
                "trung"
            ],

            fish: [
                "ca"
            ],

            chicken: [
                "ga"
            ],

            leanPork: [
                "heo",
                "lon"
            ],

            leanBeef: [
                "bo"
            ],

            tofu: [
                "dau phu",
                "dau hu"
            ]

        };


        return (
            aliases[key] || []
        )
            .some(
                alias =>
                    text.includes(
                        alias
                    )
            );

    }


function canUseFood(
    key,
    profile
) {

    const dietType =
        profile
            .nutrition
            ?.dietType
        ||
        "normal";


    return (
        dietAllows(
            key,
            dietType
        )
        &&
        !isExcluded(
            key,
            profile
        )
    );

}


function firstAllowedFood(
    keys,
    profile
) {

    return keys.find(
        key =>
            canUseFood(
                key,
                profile
            )
    )
    ||
    null;

}
    /* =====================================================
       7. CHỌN PROTEIN
    ====================================================== */

    function pickProtein(
        profile,
        index = 0
    ) {

        const dietType =
            profile.nutrition
                ?.dietType
            ||
            "normal";


        const pools = {

            normal: [

                "chicken",
                "fish",
                "leanPork",
                "leanBeef",
                "egg",
                "tofu"

            ],


            vegetarian: [

                "egg",
                "tofu",
                "yogurt",
                "milk",
                "soyMilk"

            ],


            vegan: [

                "tofu",
                "soyMilk"

            ]

        };


        const pool =
            pools[dietType]
            ||
            pools.normal;


        const allowed =
            pool.filter(

                key =>
                    dietAllows(
                        key,
                        dietType
                    )
                    &&
                    !isExcluded(
                        key,
                        profile
                    )

            );


        if (
            allowed.length === 0
        ) {

            return "tofu";

        }


        return allowed[
            index %
            allowed.length
        ];

    }



    /* =====================================================
       8. SCALE BỮA ĂN THEO CALORIE
    ====================================================== */

    function scaleToCalories(
        items,
        targetKcal
    ) {

        const totals =
            sumItems(
                items
            );


        if (
            !totals.kcal ||
            !targetKcal
        ) {

            return items;

        }


        const ratio =
            Math.max(

                0.75,

                Math.min(

                    1.25,

                    targetKcal /
                    totals.kcal

                )

            );


        return items.map(

            item =>
                nutritionFor(

                    item.key,

                    round(
                        item.amount *
                        ratio
                    )

                )

        );

    }



    /* =====================================================
       9. LÝ DO CHỌN BỮA
    ====================================================== */

    function mealReason(
        mealType,
        profile
    ) {

        const goal =
            profile.goal
                ?.primary;


        const reasons = {

            breakfast:
                "Bữa sáng ưu tiên protein cùng carbohydrate để hỗ trợ no lâu và cung cấp năng lượng cho hoạt động đầu ngày.",


            lunch:
                "Bữa trưa giữ cấu trúc cân bằng gồm protein chính, tinh bột và rau để hỗ trợ hoạt động và phục hồi.",


            snack:
                "Bữa phụ giúp phân bổ protein và năng lượng thuận tiện hơn thay vì dồn toàn bộ vào các bữa chính.",


            dinner:
                "Bữa tối tiếp tục đảm bảo protein và rau; lượng carbohydrate được giữ phù hợp với tổng năng lượng trong ngày."

        };


        let text =
            reasons[mealType]
            ||
            "Bữa ăn được xây theo mục tiêu năng lượng và macro trong ngày.";


        if (
            goal ===
            "fatloss"
        ) {

            text +=
                " Vì mục tiêu hiện tại là giảm mỡ, khẩu phần được giữ ở mức vừa phải thay vì cắt năng lượng quá sâu.";

        }


        if (
            goal ===
            "muscle"
        ) {

            text +=
                " Vì mục tiêu là tăng cơ, bữa ăn ưu tiên đủ năng lượng và protein để hỗ trợ tập luyện.";

        }


        return text;

    }



    /* =====================================================
       10. PHƯƠNG ÁN THAY THẾ
    ====================================================== */

    function replacementText(
        profile
    ) {

        const dietType =
            profile.nutrition
                ?.dietType
            ||
            "normal";


        if (
            dietType ===
            "vegan"
        ) {

            return "Có thể thay nguồn protein bằng đậu phụ hoặc sữa đậu nành; cần điều chỉnh khối lượng để giữ gần tương đương protein và năng lượng.";

        }


        if (
            dietType ===
            "vegetarian"
        ) {

            return "Có thể thay giữa trứng, đậu phụ, sữa chua hoặc sữa; cần tính lại khẩu phần thay vì đổi món theo cảm tính.";

        }


        return "Có thể thay nguồn protein bằng cá, thịt nạc, trứng hoặc đậu phụ; khi thay cần điều chỉnh lượng ăn để giữ gần tương đương protein và năng lượng.";

    }



    /* =====================================================
       11. TẠO MỘT BỮA
    ====================================================== */

    function makeMeal(
        name,
        mealType,
        items,
        profile
    ) {

        const totals =
            sumItems(
                items
            );


        return {

            name:
                name,


            mealType:
                mealType,


            items:
                items,


            totals: {

                kcal:
                    round(
                        totals.kcal
                    ),


                protein:
                    round(
                        totals.protein,
                        1
                    ),


                carbs:
                    round(
                        totals.carbs,
                        1
                    ),


                fat:
                    round(
                        totals.fat,
                        1
                    )

            },


            reason:
                mealReason(
                    mealType,
                    profile
                ),


            replacement:
                replacementText(
                    profile
                )

        };

    }



    /* =====================================================
       12. TẠO BỮA TRONG NGÀY
    ====================================================== */

    function baseMealsForDay(
        profile,
        dayIndex,
        targetCalories
    ) {

        const mealsCount =
            profile.nutrition
                ?.meals
            ||
            3;


        const proteinA =
            pickProtein(
                profile,
                dayIndex
            );


        const proteinB =
            pickProtein(
                profile,
                dayIndex + 1
            );


const isVegan =

    profile.nutrition
        ?.dietType

    ===

    "vegan";


const breakfastProtein =

    isVegan

        ? "soyMilk"

        : "egg";


        const breakfast = [

            nutritionFor(
                "oats",
                55
            ),

nutritionFor(

    breakfastProtein,

    breakfastProteinAmount

),

            nutritionFor(
                "banana",
                100
            )

        ].filter(
            Boolean
        );


        const lunch = [

            nutritionFor(
                dayIndex % 2
                    ? "brownRice"
                    : "rice",
                170
            ),

            nutritionFor(
                proteinA,
                proteinA === "tofu"
                    ? 220
                    : 150
            ),

            nutritionFor(
                "vegetables",
                220
            ),

            nutritionFor(
                "oil",
                7
            )

        ].filter(
            Boolean
        );


        const dinner = [

            nutritionFor(
                dayIndex % 3 === 0
                    ? "potato"
                    : "rice",

                dayIndex % 3 === 0
                    ? 250
                    : 150
            ),

            nutritionFor(
                proteinB,
                proteinB === "tofu"
                    ? 220
                    : 150
            ),

            nutritionFor(
                "vegetables",
                250
            ),

            nutritionFor(
                "oil",
                6
            )

        ].filter(
            Boolean
        );


nutritionFor(

    snackProtein,

    snackProteinAmount

),

            nutritionFor(
                dayIndex % 2
                    ? "apple"
                    : "orange",
                160
            )

        ].filter(
            Boolean
        );


        /* =========================
           2 BỮA
        ========================== */

        if (
            mealsCount <= 2
        ) {

            return [

                makeMeal(

                    "Bữa 1",

                    "lunch",

                    scaleToCalories(
                        lunch,
                        targetCalories * 0.5
                    ),

                    profile

                ),


                makeMeal(

                    "Bữa 2",

                    "dinner",

                    scaleToCalories(
                        dinner,
                        targetCalories * 0.5
                    ),

                    profile

                )

            ];

        }



        /* =========================
           3 BỮA
        ========================== */

        if (
            mealsCount === 3
        ) {

            return [

                makeMeal(

                    "Bữa sáng",

                    "breakfast",

                    scaleToCalories(
                        breakfast,
                        targetCalories * 0.27
                    ),

                    profile

                ),


                makeMeal(

                    "Bữa trưa",

                    "lunch",

                    scaleToCalories(
                        lunch,
                        targetCalories * 0.38
                    ),

                    profile

                ),


                makeMeal(

                    "Bữa tối",

                    "dinner",

                    scaleToCalories(
                        dinner,
                        targetCalories * 0.35
                    ),

                    profile

                )

            ];

        }



        /* =========================
           4+ BỮA
        ========================== */

        return [

            makeMeal(

                "Bữa sáng",

                "breakfast",

                scaleToCalories(
                    breakfast,
                    targetCalories * 0.23
                ),

                profile

            ),


            makeMeal(

                "Bữa trưa",

                "lunch",

                scaleToCalories(
                    lunch,
                    targetCalories * 0.34
                ),

                profile

            ),


            makeMeal(

                "Bữa phụ",

                "snack",

                scaleToCalories(
                    snack,
                    targetCalories * 0.13
                ),

                profile

            ),


            makeMeal(

                "Bữa tối",

                "dinner",

                scaleToCalories(
                    dinner,
                    targetCalories * 0.30
                ),

                profile

            )

        ];

    }



    /* =====================================================
       13. TỔNG NGÀY
    ====================================================== */

    function dayTotal(
        meals
    ) {

        return meals.reduce(

            (
                acc,
                meal
            ) => {

                acc.kcal +=
                    meal.totals.kcal;


                acc.protein +=
                    meal.totals.protein;


                acc.carbs +=
                    meal.totals.carbs;


                acc.fat +=
                    meal.totals.fat;


                return acc;

            },

            {
                kcal: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }

        );

    }



    /* =====================================================
       14. THỰC ĐƠN 7 NGÀY
    ====================================================== */

    function createSevenDayPlan(
        profile,
        healthResult
    ) {

        const calorieTarget =
            healthResult
                ?.energy
                ?.calorieTarget;


        if (!calorieTarget) {

            return [];

        }


        const targetCalories =
            calorieTarget.midpoint;


        const dayNames = [

            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
            "Chủ Nhật"

        ];


        return dayNames.map(

            (
                day,
                index
            ) => {

                const meals =
                    baseMealsForDay(

                        profile,

                        index,

                        targetCalories

                    );


                const totals =
                    dayTotal(
                        meals
                    );


                return {

                    day:
                        day,


                    targetCalories:
                        targetCalories,


                    meals:
                        meals,


                    totals: {

                        kcal:
                            round(
                                totals.kcal
                            ),


                        protein:
                            round(
                                totals.protein,
                                1
                            ),


                        carbs:
                            round(
                                totals.carbs,
                                1
                            ),


                        fat:
                            round(
                                totals.fat,
                                1
                            )

                    }

                };

            }

        );

    }



    /* =====================================================
       15. ĂN NGOÀI
    ====================================================== */

    function eatingOutGuide(
        profile
    ) {

        const goal =
            profile.goal
                ?.primary;


        const guide = [

            "Ưu tiên một nguồn protein rõ ràng trong bữa ăn như thịt nạc, cá, trứng hoặc đậu phụ tùy kiểu ăn.",

            "Giữ phần rau tương đối lớn khi có thể.",

            "Chọn phần tinh bột phù hợp thay vì loại bỏ hoàn toàn.",

            "Nếu món có nhiều dầu hoặc sốt, có thể sử dụng ít hơn để kiểm soát năng lượng.",

            "Không cần bù trừ cực đoan ở bữa sau nếu một bữa ăn cao năng lượng hơn dự kiến."

        ];


        if (
            goal ===
            "fatloss"
        ) {

            guide.push(
                "Khi mục tiêu là giảm mỡ, ưu tiên khẩu phần vừa phải và hạn chế đồ uống nhiều năng lượng nếu không thực sự cần."
            );

        }


        if (
            goal ===
            "muscle"
        ) {

            guide.push(
                "Khi mục tiêu là tăng cơ, tránh để bữa ăn ngoài trở thành bữa quá ít protein hoặc quá thấp năng lượng."
            );

        }


        return guide;

    }



    /* =====================================================
       16. DANH SÁCH MUA SẮM
    ====================================================== */

    function shoppingList(
        plan
    ) {

        const map = {};


        plan.forEach(

            day => {

                day.meals
                    .forEach(

                        meal => {

                            meal.items
                                .forEach(

                                    item => {

                                        const key =
                                            item.name
                                            +
                                            "|"
                                            +
                                            item.unit;


                                        if (!map[key]) {

                                            map[key] = {

                                                name:
                                                    item.name,

                                                unit:
                                                    item.unit,

                                                amount:
                                                    0

                                            };

                                        }


                                        map[key].amount +=
                                            item.amount;

                                    }

                                );

                        }

                    );

            }

        );


        return Object
            .values(
                map
            )

            .map(
                item => ({

                    ...item,

                    amount:
                        round(
                            item.amount
                        )

                })
            )

            .sort(
                (
                    a,
                    b
                ) =>
                    a.name.localeCompare(
                        b.name,
                        "vi"
                    )
            );

    }



    /* =====================================================
       17. CHIẾN LƯỢC DINH DƯỠNG
    ====================================================== */

    function buildStrategy(
        profile,
        healthResult
    ) {

        const energy =
            healthResult
                ?.energy
                ?.calorieTarget;


        const macro =
            healthResult
                ?.nutrition;


        return {

            calorieRange:
                energy
                    ? `${energy.min}–${energy.max} kcal/ngày`
                    : "Chưa tính được",


            proteinRange:
                macro?.protein
                    ? `${macro.protein.min}–${macro.protein.max} g/ngày`
                    : "Chưa tính được",


            fatRange:
                macro?.fat
                    ? `${macro.fat.min}–${macro.fat.max} g/ngày`
                    : "Chưa tính được",


            carbReference:
                macro?.carbs
                    ? `${macro.carbs.value} g/ngày`
                    : "Chưa tính được",


            meals:
                profile.nutrition
                    ?.meals
                ||
                3,


            explanation:
                energy
                    ?.strategy
                ||
                "Kế hoạch năng lượng được xây từ TDEE ước tính và mục tiêu hiện tại.",


            note:
                "Thực đơn là mẫu khởi đầu. Khối lượng và macro là ước tính, không cần đạt chính xác từng gram mỗi ngày."

        };

    }



    /* =====================================================
       18. RUN NUTRITION ENGINE
    ====================================================== */

    function run(
        profile,
        healthResult
    ) {

        if (
            !profile ||
            !healthResult
        ) {

            return {

                success:
                    false,

                error:
                    "Thiếu dữ liệu hồ sơ hoặc Health Engine."

            };

        }


        if (
            healthResult
                .safety
                ?.allowFullAutomation
            === false
        ) {

            return {

                success:
                    false,

                blocked:
                    true,

                reason:
                    "Safety Gate đang chặn tự động hóa kế hoạch dinh dưỡng chuyên sâu. Hãy xác nhận với chuyên gia phù hợp trước khi áp dụng kế hoạch cá nhân hóa."

            };

        }


        const plan =
            createSevenDayPlan(

                profile,

                healthResult

            );


        if (
            !plan.length
        ) {

            return {

                success:
                    false,

                error:
                    "Chưa đủ dữ liệu để tạo thực đơn 7 ngày."

            };

        }


        return {

            success:
                true,


            engine:
                "SportHub Nutrition Engine v1.0",


            strategy:
                buildStrategy(

                    profile,

                    healthResult

                ),


            plan:
                plan,


            eatingOut:
                eatingOutGuide(
                    profile
                ),


            shoppingList:
                shoppingList(
                    plan
                ),


            rules: {

                estimatedNutrition:
                    true,

                exactDailyTargetRequired:
                    false,

                foodPreferenceAware:
                    true,

                allergyTextFilter:
                    true,

                vietnameseFoodPriority:
                    true

            }

        };

    }



    /* =====================================================
       19. PUBLIC API
    ====================================================== */

    return {

        run:
            run,

        foodDB:
            FOOD_DB,

        createSevenDayPlan:
            createSevenDayPlan,

        eatingOutGuide:
            eatingOutGuide,

        shoppingList:
            shoppingList

    };


})();