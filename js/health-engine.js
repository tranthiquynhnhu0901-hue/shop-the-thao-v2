/* =========================================================
   SPORTHUB HEALTH ENGINE
   Version 1.0
   Health & Fitness Planning System
========================================================= */

window.SportHubHealthEngine = (() => {


    /* =====================================================
       1. HELPER
    ====================================================== */

    function round(value, decimals = 0) {

        const factor =
            Math.pow(10, decimals);

        return Math.round(
            value * factor
        ) / factor;

    }


    function clamp(
        value,
        min,
        max
    ) {

        return Math.min(
            Math.max(value, min),
            max
        );

    }



    /* =====================================================
       2. BMI
    ====================================================== */

    function calculateBMI(
        weight,
        height
    ) {

        if (
            !weight ||
            !height
        ) {

            return null;

        }


        const heightM =
            height / 100;


        const value =
            weight /
            (
                heightM *
                heightM
            );


        return {

            value:
                round(
                    value,
                    1
                ),

            note:
                "BMI là chỉ số sàng lọc dựa trên cân nặng và chiều cao. BMI không phải tỷ lệ mỡ cơ thể và không tự mô tả đầy đủ thành phần cơ thể, sức mạnh hay tình trạng sức khỏe."

        };

    }



    /* =====================================================
       3. RMR - MIFFLIN ST JEOR
    ====================================================== */

    function calculateRMR(
        profile
    ) {

        const weight =
            profile.weight;

        const height =
            profile.height;

        const age =
            profile.age;

        const sex =
            profile.sex;


        if (
            !weight ||
            !height ||
            !age ||
            !sex
        ) {

            return null;

        }


        let value;


        if (
            sex === "male"
        ) {

            value =
                (
                    10 *
                    weight
                )
                +
                (
                    6.25 *
                    height
                )
                -
                (
                    5 *
                    age
                )
                +
                5;

        }


        else {

            value =
                (
                    10 *
                    weight
                )
                +
                (
                    6.25 *
                    height
                )
                -
                (
                    5 *
                    age
                )
                -
                161;

        }


        return {

            value:
                round(value),

            formula:
                "Mifflin-St Jeor",

            note:
                "RMR là mức năng lượng cơ thể ước tính sử dụng trong trạng thái nghỉ. Đây là giá trị ước tính, không phải phép đo chuyển hóa trực tiếp."

        };

    }



    /* =====================================================
       4. HỆ SỐ VẬN ĐỘNG
    ====================================================== */

    function estimateActivityFactor(
        profile
    ) {

        const activity =
            profile.activity || {};


        const jobFactors = {

            sedentary:
                1.25,

            light:
                1.35,

            moderate:
                1.50,

            active:
                1.65,

            veryActive:
                1.80

        };


        let factor =
            jobFactors[
                activity.jobActivity
            ]
            ||
            1.30;


        const steps =
            Number(
                activity.steps || 0
            );


        if (
            steps < 3000
        ) {

            factor -=
                0.05;

        }


        if (
            steps >= 6000
        ) {

            factor +=
                0.05;

        }


        if (
            steps >= 9000
        ) {

            factor +=
                0.05;

        }


        if (
            steps >= 12000
        ) {

            factor +=
                0.05;

        }


        const sittingHours =
            Number(
                activity.sittingHours || 0
            );


        if (
            sittingHours >= 10
        ) {

            factor -=
                0.05;

        }


        const trainingDays =
            Number(
                activity.currentTrainingDays
                ||
                0
            );


        if (
            trainingDays >= 3
        ) {

            factor +=
                0.05;

        }


        if (
            trainingDays >= 5
        ) {

            factor +=
                0.05;

        }


        if (
            activity.dailyActivity ===
            "medium"
        ) {

            factor +=
                0.03;

        }


        if (
            activity.dailyActivity ===
            "high"
        ) {

            factor +=
                0.07;

        }


        factor =
            clamp(
                factor,
                1.20,
                2.00
            );


        return {

            value:
                round(
                    factor,
                    2
                ),

            note:
                "Hệ số vận động là ước tính từ tính chất công việc, số bước, thời gian ngồi, hoạt động hằng ngày và tập luyện. Giá trị thực tế nên được hiệu chỉnh bằng xu hướng cân nặng và mức hoạt động trong khoảng 2–3 tuần."

        };

    }



    /* =====================================================
       5. TDEE
    ====================================================== */

    function calculateTDEE(
        rmr,
        activityFactor
    ) {

        if (
            !rmr ||
            !activityFactor
        ) {

            return null;

        }


        const center =
            rmr.value *
            activityFactor.value;


        return {

            min:
                round(
                    center *
                    0.95
                ),

            midpoint:
                round(
                    center
                ),

            max:
                round(
                    center *
                    1.05
                ),

            note:
                "TDEE là nhu cầu năng lượng duy trì ước tính. Thay vì xem đây là một con số tuyệt đối, nên sử dụng một khoảng và hiệu chỉnh theo dữ liệu thực tế trong 2–3 tuần."

        };

    }



    /* =====================================================
       6. CALORIE TARGET
    ====================================================== */

    function calculateCalorieTarget(
        profile,
        tdee
    ) {

        if (!tdee) {

            return null;

        }


        const goal =
            profile.goal
                ?.primary;


        let minFactor =
            0.95;

        let maxFactor =
            1.05;

        let strategy =
            "Duy trì năng lượng quanh mức TDEE ước tính.";


        if (
            goal ===
            "fatloss"
        ) {

            minFactor =
                0.85;

            maxFactor =
                0.90;

            strategy =
                "Mục tiêu giảm mỡ sử dụng mức thâm hụt khởi đầu khoảng 10–15% so với TDEE ước tính, thay vì cắt năng lượng quá sâu.";

        }


        else if (
            goal ===
            "muscle"
        ) {

            minFactor =
                1.05;

            maxFactor =
                1.10;

            strategy =
                "Mục tiêu tăng cơ sử dụng mức dư năng lượng nhẹ khoảng 5–10% so với TDEE ước tính.";

        }


        else if (
            goal ===
            "maintenance"
        ) {

            minFactor =
                0.95;

            maxFactor =
                1.05;

            strategy =
                "Mục tiêu duy trì sử dụng khoảng năng lượng gần mức TDEE ước tính.";

        }


        else {

            minFactor =
                0.95;

            maxFactor =
                1.05;

            strategy =
                "Với mục tiêu hiện tại, năng lượng được giữ gần mức duy trì để hỗ trợ tập luyện, phục hồi và theo dõi phản ứng thực tế.";

        }


        const min =
            round(
                tdee.midpoint *
                minFactor
            );


        const max =
            round(
                tdee.midpoint *
                maxFactor
            );


        return {

            min:
                min,

            midpoint:
                round(
                    (
                        min +
                        max
                    )
                    /
                    2
                ),

            max:
                max,

            strategy:
                strategy,

            note:
                "Đây là mức khởi đầu. Không nên điều chỉnh calorie chỉ dựa trên vài ngày dữ liệu; ưu tiên đánh giá xu hướng trong khoảng 2–3 tuần khi mức tuân thủ tương đối ổn định."

        };

    }



    /* =====================================================
       7. PROTEIN
    ====================================================== */

    function calculateProtein(
        profile
    ) {

        const weight =
            profile.weight;

        const goal =
            profile.goal
                ?.primary;


        if (!weight) {

            return null;

        }


        let minRate =
            1.4;

        let maxRate =
            1.6;


        if (
            goal === "fatloss" ||
            goal === "muscle" ||
            goal === "strength"
        ) {

            minRate =
                1.6;

            maxRate =
                2.0;

        }


        return {

            min:
                round(
                    weight *
                    minRate
                ),

            max:
                round(
                    weight *
                    maxRate
                ),

            minRate:
                minRate,

            maxRate:
                maxRate,

            note:
                "Protein được đặt theo cân nặng và mục tiêu tập luyện. Đây là khoảng mục tiêu thực tế thay vì một con số bắt buộc tuyệt đối."

        };

    }



    /* =====================================================
       8. FAT
    ====================================================== */

    function calculateFat(
        calorieTarget
    ) {

        if (!calorieTarget) {

            return null;

        }


        const calories =
            calorieTarget.midpoint;


        return {

            min:
                round(
                    (
                        calories *
                        0.25
                    )
                    /
                    9
                ),

            midpoint:
                round(
                    (
                        calories *
                        0.30
                    )
                    /
                    9
                ),

            max:
                round(
                    (
                        calories *
                        0.35
                    )
                    /
                    9
                ),

            note:
                "Chất béo được bố trí trong khoảng tham khảo khoảng 25–35% tổng năng lượng của kế hoạch."

        };

    }



    /* =====================================================
       9. CARBOHYDRATE
    ====================================================== */

    function calculateCarbs(
        calorieTarget,
        protein,
        fat
    ) {

        if (
            !calorieTarget ||
            !protein ||
            !fat
        ) {

            return null;

        }


        const calorie =
            calorieTarget.midpoint;


        const proteinMid =
            (
                protein.min +
                protein.max
            )
            /
            2;


        const proteinCalories =
            proteinMid *
            4;


        const fatCalories =
            fat.midpoint *
            9;


        const carbCalories =
            Math.max(
                calorie
                -
                proteinCalories
                -
                fatCalories,
                0
            );


        return {

            value:
                round(
                    carbCalories /
                    4
                ),

            note:
                "Carbohydrate được phân bổ từ phần năng lượng còn lại sau khi xác định protein và chất béo."

        };

    }



    /* =====================================================
       10. RECOVERY
    ====================================================== */

    function analyzeRecovery(
        profile
    ) {

        const recovery =
            profile.recovery || {};


        const sleepHours =
            Number(
                recovery.sleepHours
                ||
                0
            );


        const energy =
            Number(
                recovery.energy
                ||
                0
            );


        const stress =
            Number(
                recovery.stress
                ||
                0
            );


        const fatigue =
            Number(
                recovery.fatigue
                ||
                0
            );


        let sleepAction;


        if (
            sleepHours < 7
        ) {

            sleepAction =
                "Giấc ngủ hiện dưới 7 giờ. Thay vì cố thay đổi quá lớn ngay lập tức, ưu tiên tăng thời gian ngủ từng bước khoảng 15–20 phút và theo dõi năng lượng, stress và mức mệt.";

        }


        else {

            sleepAction =
                "Thời lượng ngủ hiện đạt từ khoảng 7 giờ trở lên. Tiếp tục ưu tiên lịch ngủ tương đối ổn định và theo dõi chất lượng phục hồi thực tế.";

        }


        return {

            sleepHours:
                sleepHours,

            energy:
                energy,

            stress:
                stress,

            fatigue:
                fatigue,

            sleepAction:
                sleepAction

        };

    }



    /* =====================================================
       11. SAFETY GATE
    ====================================================== */

    function evaluateSafety(
        profile
    ) {

        const safety =
            profile.safety || {};


        const reasons =
            [];


        if (
            safety.chest ===
            "yes"
        ) {

            reasons.push(
                "Đau hoặc tức ngực bất thường khi vận động."
            );

        }


        if (
            safety.faint ===
            "yes"
        ) {

            reasons.push(
                "Có tiền sử ngất hoặc chóng mặt nghiêm trọng khi vận động."
            );

        }


        if (
            safety.breath ===
            "yes"
        ) {

            reasons.push(
                "Khó thở bất thường khi vận động nhẹ."
            );

        }


        if (
            safety.medical ===
            "yes"
        ) {

            reasons.push(
                "Có tình trạng sức khỏe đang cần bác sĩ hoặc chuyên gia quản lý."
            );

        }


        if (
            safety.surgery ===
            "yes"
        ) {

            reasons.push(
                "Có phẫu thuật hoặc thủ thuật gần đây."
            );

        }


        if (
            safety.pregnancy ===
            "yes"
        ) {

            reasons.push(
                "Đang mang thai hoặc trong giai đoạn sau sinh."
            );

        }


        if (
            reasons.length >
            0
        ) {

            return {

                level:
                    "stop",

                allowFullAutomation:
                    false,

                reasons:
                    reasons,

                message:
                    "Hệ thống không tự tạo kế hoạch chuyên sâu trong trường hợp này. Nên trao đổi với bác sĩ hoặc chuyên gia phù hợp trước khi áp dụng chương trình tập luyện hoặc dinh dưỡng cá nhân hóa."

            };

        }


        if (
            safety.injury ===
            "yes"
        ) {

            return {

                level:
                    "caution",

                allowFullAutomation:
                    true,

                reasons: [
                    "Có chấn thương hoặc đau đang hạn chế vận động."
                ],

                message:
                    "Hệ thống ghi nhận chấn thương hoặc đau hiện tại. Kế hoạch chỉ mang tính tham khảo và cần tránh chuyển động làm triệu chứng tăng lên."

            };

        }


        return {

            level:
                "safe",

            allowFullAutomation:
                true,

            reasons:
                [],

            message:
                "Bảng hỏi hiện chưa ghi nhận dấu hiệu cảnh báo chính trong các câu hỏi đã cung cấp. Kết quả này không phải xác nhận y khoa hoặc chẩn đoán sức khỏe."

        };

    }



    /* =====================================================
       12. RUN ENGINE
    ====================================================== */

    function run(
        profile
    ) {

        if (!profile) {

            return {

                success:
                    false,

                error:
                    "Không có dữ liệu hồ sơ."

            };

        }


        const safety =
            evaluateSafety(
                profile
            );


        const bmi =
            calculateBMI(
                profile.weight,
                profile.height
            );


        const rmr =
            calculateRMR(
                profile
            );


        const activityFactor =
            estimateActivityFactor(
                profile
            );


        const tdee =
            calculateTDEE(
                rmr,
                activityFactor
            );


        const calorieTarget =
            calculateCalorieTarget(
                profile,
                tdee
            );


        const protein =
            calculateProtein(
                profile
            );


        const fat =
            calculateFat(
                calorieTarget
            );


        const carbs =
            calculateCarbs(
                calorieTarget,
                protein,
                fat
            );


        const recovery =
            analyzeRecovery(
                profile
            );


        return {

            success:
                true,


            engine:
                "SportHub Health Engine v1.0",


            safety:
                safety,


            body: {

                bmi:
                    bmi,

                rmr:
                    rmr

            },


            energy: {

                activityFactor:
                    activityFactor,

                tdee:
                    tdee,

                calorieTarget:
                    calorieTarget

            },


            nutrition: {

                protein:
                    protein,

                fat:
                    fat,

                carbs:
                    carbs

            },


            recovery:
                recovery,


            rules: {

                diagnosticTool:
                    false,

                trendBasedAdjustment:
                    true,

                adjustmentWindow:
                    "2–3 tuần",

                bmiIsScreeningOnly:
                    true

            }

        };

    }



    /* =====================================================
       13. PUBLIC API
    ====================================================== */

    return {

        run:
            run,

        calculateBMI:
            calculateBMI,

        calculateRMR:
            calculateRMR,

        estimateActivityFactor:
            estimateActivityFactor,

        calculateTDEE:
            calculateTDEE,

        calculateCalorieTarget:
            calculateCalorieTarget,

        calculateProtein:
            calculateProtein,

        calculateFat:
            calculateFat,

        calculateCarbs:
            calculateCarbs,

        analyzeRecovery:
            analyzeRecovery,

        evaluateSafety:
            evaluateSafety

    };


})();