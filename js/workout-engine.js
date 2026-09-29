/* =========================================================
   SPORTHUB WORKOUT ENGINE
   Version 2.0
   Personalized Workout Planning + Video-ready Exercise IDs
========================================================= */

window.SportHubWorkoutEngine = (() => {

    "use strict";


    /* =====================================================
       1. HELPERS
    ====================================================== */

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


    function clone(
        value
    ) {

        return JSON.parse(
            JSON.stringify(
                value
            )
        );

    }


    function uniqueExercises(
        items
    ) {

        const seen =
            new Set();


        return items
            .filter(
                Boolean
            )
            .filter(
                exercise => {

                    const key =
                        exercise.exerciseId ||
                        exercise.name;


                    if (
                        !key ||
                        seen.has(key)
                    ) {

                        return false;

                    }


                    seen.add(
                        key
                    );


                    return true;

                }
            );

    }


    function getTrainingDays(
        profile
    ) {

        const days =
            Number(
                profile
                    ?.training
                    ?.days
            );


        if (
            !Number.isFinite(days)
        ) {

            return 3;

        }


        return clamp(
            Math.round(days),
            1,
            6
        );

    }


    function hasEquipment(
        profile,
        equipment
    ) {

        const equipmentList =

            Array.isArray(
                profile
                    ?.training
                    ?.equipment
            )

                ? profile
                    .training
                    .equipment

                : [];


        return equipmentList
            .includes(
                equipment
            );

    }


    function isBeginner(
        profile
    ) {

        return (

            profile
                ?.training
                ?.experience

            ===

            "beginner"

        );

    }


    function hasInjuryFlag(
        profile
    ) {

        return (

            profile
                ?.safety
                ?.injury

            ===

            "yes"

        );

    }



    /* =====================================================
       2. THƯ VIỆN 20 BÀI CÓ VIDEO

       exerciseId phải khớp key trong:
       js/exercise-media.js
    ====================================================== */

    const exerciseLibrary = {


        /* =================================================
           LOWER BODY
        ================================================== */

        bodyweightSquat: {

            exerciseId:
                "bodyweight-squat",

            name:
                "Bodyweight Squat",

            category:
                "Knee dominant",

            target:
                "Củng cố mẫu squat, phát triển sức mạnh chân và khả năng kiểm soát thân người.",

            sets:
                3,

            reps:
                "10–15",

            rest:
                "60–75 giây",

            restSeconds:
                60,

            rpe:
                "RPE 5–7",

            rir:
                "Còn khoảng 3–5 lần lặp có thể thực hiện.",

            technique: [

                "Giữ thân người ổn định.",

                "Đầu gối di chuyển cùng hướng với mũi chân.",

                "Giữ bàn chân tiếp xúc ổn định với mặt đất.",

                "Kiểm soát cả pha xuống và pha đứng lên."

            ],

            mistakes: [

                "Đổ người quá nhiều về trước.",

                "Đầu gối đổ vào trong.",

                "Bật nhanh ở vị trí thấp.",

                "Mất thăng bằng."

            ],

            regression:
                "Squat xuống ghế hoặc giảm biên độ.",

            progression:
                "Tăng dần số lần lặp trong vùng quy định trước khi tăng độ khó.",

            stopCondition:
                "Dừng nếu đau gối tăng, đau lưng bất thường hoặc chóng mặt.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        forwardLunge: {

            exerciseId:
                "forward-lunge",

            name:
                "Forward Lunge",

            category:
                "Knee dominant",

            target:
                "Phát triển sức mạnh từng chân, khả năng kiểm soát hông và thăng bằng.",

            sets:
                3,

            reps:
                "8–10 mỗi bên",

            rest:
                "60–75 giây",

            restSeconds:
                60,

            rpe:
                "RPE 6–7",

            rir:
                "Còn khoảng 3 lần lặp dự phòng.",

            technique: [

                "Bước chân về trước với khoảng cách vừa đủ.",

                "Giữ thân người ổn định.",

                "Đầu gối chân trước đi cùng hướng bàn chân.",

                "Đẩy qua bàn chân trước để trở về vị trí đầu."

            ],

            mistakes: [

                "Bước quá ngắn.",

                "Đầu gối đổ vào trong.",

                "Mất thăng bằng.",

                "Lao người quá nhanh về trước."

            ],

            regression:
                "Giảm biên độ hoặc dùng điểm tựa để giữ thăng bằng.",

            progression:
                "Tăng reps trước, sau đó tăng độ khó khi kỹ thuật ổn định.",

            stopCondition:
                "Dừng nếu đau gối, hông hoặc cổ chân tăng rõ rệt.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        reverseLunge: {

            exerciseId:
                "reverse-lunge",

            name:
                "Reverse Lunge",

            category:
                "Knee dominant",

            target:
                "Phát triển sức mạnh từng chân, khả năng kiểm soát hông và thăng bằng.",

            sets:
                3,

            reps:
                "8–10 mỗi bên",

            rest:
                "60–75 giây",

            restSeconds:
                60,

            rpe:
                "RPE 6–7",

            rir:
                "Khoảng 3 lần lặp dự phòng.",

            technique: [

                "Bước chân ra sau có kiểm soát.",

                "Giữ thân người ổn định.",

                "Đầu gối chân trước đi theo hướng bàn chân.",

                "Đẩy qua bàn chân trước để trở về vị trí đầu."

            ],

            mistakes: [

                "Bước quá ngắn.",

                "Đầu gối đổ vào trong.",

                "Mất thăng bằng.",

                "Đẩy quá nhiều bằng chân sau."

            ],

            regression:
                "Split Squat có điểm tựa hoặc giảm biên độ.",

            progression:
                "Tăng số lần lặp rồi mới tăng độ khó.",

            stopCondition:
                "Dừng nếu đau gối hoặc cổ chân tăng rõ rệt.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        gluteBridge: {

            exerciseId:
                "glute-bridge",

            name:
                "Glute Bridge",

            category:
                "Hip dominant",

            target:
                "Phát triển cơ mông và khả năng kiểm soát động tác duỗi hông.",

            sets:
                3,

            reps:
                "10–15",

            rest:
                "45–60 giây",

            restSeconds:
                45,

            rpe:
                "RPE 6–7",

            rir:
                "Còn khoảng 3–4 lần lặp.",

            technique: [

                "Đặt bàn chân ổn định trên sàn.",

                "Siết nhẹ bụng trước khi nâng hông.",

                "Đẩy hông lên bằng cơ mông.",

                "Không ngửa lưng quá mức ở vị trí cao nhất."

            ],

            mistakes: [

                "Ưỡn lưng quá mức.",

                "Đẩy bằng mũi chân.",

                "Nâng hông quá nhanh.",

                "Không kiểm soát pha hạ."

            ],

            regression:
                "Giảm biên độ hoặc giữ ngắn ở vị trí cao nhất.",

            progression:
                "Tăng reps hoặc giữ 1–2 giây ở vị trí co cơ.",

            stopCondition:
                "Dừng nếu đau lưng hoặc đau hông tăng.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },



        /* =================================================
           UPPER BODY
        ================================================== */

        pushUp: {

            exerciseId:
                "push-up",

            name:
                "Push Up",

            category:
                "Push",

            target:
                "Phát triển cơ ngực, vai trước, tay sau và khả năng ổn định thân người.",

            sets:
                3,

            reps:
                "6–12",

            rest:
                "60–90 giây",

            restSeconds:
                60,

            rpe:
                "RPE 6–8",

            rir:
                "Còn khoảng 2–4 lần lặp.",

            technique: [

                "Giữ thân người thành một đường tương đối thẳng.",

                "Đặt tay ở vị trí thoải mái.",

                "Hạ người có kiểm soát.",

                "Không để hông võng xuống."

            ],

            mistakes: [

                "Hông võng.",

                "Cổ rướn quá mức.",

                "Khuỷu tay mở quá rộng.",

                "Rút ngắn biên độ khi mệt."

            ],

            regression:
                "Knee Push Up hoặc Push Up với điểm tựa cao.",

            progression:
                "Tăng reps trước khi chuyển sang biến thể khó hơn.",

            stopCondition:
                "Dừng nếu đau vai, cổ tay hoặc ngực bất thường.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        kneePushUp: {

            exerciseId:
                "knee-push-up",

            name:
                "Knee Push Up",

            category:
                "Push",

            target:
                "Xây dựng nền tảng sức mạnh đẩy trước khi chuyển sang Push Up tiêu chuẩn.",

            sets:
                3,

            reps:
                "8–12",

            rest:
                "45–60 giây",

            restSeconds:
                45,

            rpe:
                "RPE 5–7",

            rir:
                "Còn khoảng 3–5 lần lặp.",

            technique: [

                "Giữ thân người từ đầu gối đến vai tương đối thẳng.",

                "Siết nhẹ bụng.",

                "Hạ ngực có kiểm soát.",

                "Đẩy lên mà không giật người."

            ],

            mistakes: [

                "Hông võng.",

                "Đưa đầu về trước.",

                "Khuỷu tay mở quá rộng."

            ],

            regression:
                "Push Up với tay đặt trên bề mặt cao.",

            progression:
                "Tăng reps rồi chuyển dần sang Push Up tiêu chuẩn.",

            stopCondition:
                "Dừng nếu đau vai, cổ tay hoặc ngực bất thường.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        shoulderPress: {

            exerciseId:
                "dumbbell-shoulder-press",

            name:
                "Dumbbell Shoulder Press",

            category:
                "Push",

            target:
                "Phát triển sức mạnh vai và tay sau.",

            sets:
                2,

            reps:
                "8–12",

            rest:
                "75–90 giây",

            restSeconds:
                75,

            rpe:
                "RPE 6–7",

            rir:
                "Khoảng 3 lần lặp dự phòng.",

            technique: [

                "Giữ thân người ổn định.",

                "Không ngửa lưng quá mức.",

                "Đẩy tạ trong biên độ không gây đau.",

                "Hạ tạ có kiểm soát."

            ],

            mistakes: [

                "Ưỡn lưng quá nhiều.",

                "Dùng chân bật tạ.",

                "Ép vào biên độ gây đau."

            ],

            regression:
                "Giảm tải hoặc dùng Knee Push Up nếu không có tạ.",

            progression:
                "Tăng reps trước rồi tăng tải nhỏ.",

            stopCondition:
                "Nếu đau vai tăng, dừng và chuyển sang biến thể không đau.",

            equipmentRequired: [
                "dumbbell"
            ],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        dumbbellRow: {

            exerciseId:
                "dumbbell-bent-over-row",

            name:
                "Dumbbell Bent Over Row",

            category:
                "Pull",

            target:
                "Phát triển cơ lưng, cơ quanh bả vai và sức mạnh kéo.",

            sets:
                3,

            reps:
                "8–12 mỗi bên",

            rest:
                "75–90 giây",

            restSeconds:
                75,

            rpe:
                "RPE 6–8",

            rir:
                "Khoảng 2–4 lần lặp dự phòng.",

            technique: [

                "Giữ thân người ổn định.",

                "Giữ cột sống ở tư thế kiểm soát.",

                "Kéo khuỷu tay về sau.",

                "Hạ tạ có kiểm soát."

            ],

            mistakes: [

                "Giật tạ bằng thân người.",

                "Nhún vai quá mức.",

                "Rút ngắn biên độ.",

                "Dùng tải quá nặng."

            ],

            regression:
                "Giảm tải và dùng điểm tựa nếu cần.",

            progression:
                "Tăng reps trước rồi mới tăng tải.",

            stopCondition:
                "Dừng nếu đau lưng, vai hoặc xuất hiện tê lan.",

            equipmentRequired: [
                "dumbbell"
            ],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        bicepsCurl: {

            exerciseId:
                "dumbbell-biceps-curl",

            name:
                "Dumbbell Biceps Curl",

            category:
                "Arms",

            target:
                "Phát triển sức mạnh cơ tay trước với động tác kiểm soát.",

            sets:
                2,

            reps:
                "10–15",

            rest:
                "45–60 giây",

            restSeconds:
                45,

            rpe:
                "RPE 6–8",

            rir:
                "Còn khoảng 2–4 lần lặp.",

            technique: [

                "Giữ khuỷu tay gần thân người.",

                "Không đung đưa thân để lấy đà.",

                "Nâng và hạ tạ có kiểm soát."

            ],

            mistakes: [

                "Đung đưa người.",

                "Đưa khuỷu tay quá xa về trước.",

                "Thả tạ quá nhanh."

            ],

            regression:
                "Giảm tải.",

            progression:
                "Tăng reps trước rồi tăng tải ở mức nhỏ.",

            stopCondition:
                "Dừng nếu đau khuỷu tay, cổ tay hoặc vai tăng.",

            equipmentRequired: [
                "dumbbell"
            ],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },



        /* =================================================
           CORE
        ================================================== */

        plank: {

            exerciseId:
                "plank",

            name:
                "Plank",

            category:
                "Core",

            target:
                "Phát triển khả năng ổn định thân người và kiểm soát cột sống.",

            sets:
                3,

            reps:
                "20–45 giây",

            durationSeconds:
                30,

            rest:
                "45–60 giây",

            restSeconds:
                45,

            rpe:
                "RPE 6–7",

            rir:
                "Dừng trước khi tư thế bắt đầu mất rõ rệt.",

            technique: [

                "Giữ đầu, thân và hông tương đối thẳng.",

                "Siết nhẹ bụng và mông.",

                "Thở bình thường.",

                "Không võng lưng."

            ],

            mistakes: [

                "Võng lưng.",

                "Nâng hông quá cao.",

                "Nín thở.",

                "Cố giữ dù tư thế đã hỏng."

            ],

            regression:
                "Plank với đầu gối chạm sàn.",

            progression:
                "Tăng thời gian từ từ hoặc chuyển sang biến thể khó hơn.",

            stopCondition:
                "Dừng nếu đau lưng hoặc vai tăng.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "time",

            videoAvailable:
                true

        },


        sidePlank: {

            exerciseId:
                "side-plank",

            name:
                "Side Plank",

            category:
                "Core",

            target:
                "Tăng khả năng ổn định thân bên và kiểm soát hông.",

            sets:
                2,

            reps:
                "20–30 giây mỗi bên",

            durationSeconds:
                20,

            rest:
                "30–45 giây",

            restSeconds:
                30,

            rpe:
                "RPE 5–7",

            rir:
                "Dừng trước khi hông bắt đầu tụt rõ rệt.",

            technique: [

                "Giữ vai, hông và chân tương đối thẳng hàng.",

                "Không để vai sụp xuống.",

                "Thở đều trong suốt thời gian giữ."

            ],

            mistakes: [

                "Hông tụt.",

                "Xoay thân quá nhiều.",

                "Nín thở."

            ],

            regression:
                "Side Plank với đầu gối gập.",

            progression:
                "Tăng thời gian từng bước nhỏ.",

            stopCondition:
                "Dừng nếu đau vai hoặc đau lưng tăng.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "time",

            videoAvailable:
                true

        },


        deadBug: {

            exerciseId:
                "dead-bug",

            name:
                "Dead Bug",

            category:
                "Core",

            target:
                "Cải thiện kiểm soát thân người và phối hợp tay chân.",

            sets:
                3,

            reps:
                "6–10 mỗi bên",

            rest:
                "45–60 giây",

            restSeconds:
                45,

            rpe:
                "RPE 5–7",

            rir:
                "Ưu tiên kỹ thuật hơn mệt cơ.",

            technique: [

                "Giữ lưng dưới ổn định.",

                "Di chuyển tay và chân từ từ.",

                "Thở đều.",

                "Chỉ mở rộng đến mức còn kiểm soát."

            ],

            mistakes: [

                "Lưng dưới nhấc khỏi vị trí kiểm soát.",

                "Di chuyển quá nhanh.",

                "Cố duỗi quá xa."

            ],

            regression:
                "Chỉ di chuyển chân hoặc chỉ di chuyển tay.",

            progression:
                "Tăng biên độ hoặc thêm kháng lực nhẹ.",

            stopCondition:
                "Dừng khi đau lưng tăng.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        birdDog: {

            exerciseId:
                "bird-dog",

            name:
                "Bird Dog",

            category:
                "Core / Stability",

            target:
                "Cải thiện khả năng ổn định thân người và phối hợp tay chân đối bên.",

            sets:
                3,

            reps:
                "6–10 mỗi bên",

            rest:
                "30–45 giây",

            restSeconds:
                30,

            rpe:
                "RPE 4–6",

            rir:
                "Ưu tiên kiểm soát hơn số lần lặp.",

            technique: [

                "Giữ lưng ở vị trí ổn định.",

                "Duỗi tay và chân đối bên từ từ.",

                "Hạn chế xoay hông.",

                "Thở đều."

            ],

            mistakes: [

                "Ngửa lưng.",

                "Xoay hông quá nhiều.",

                "Đưa tay hoặc chân quá cao."

            ],

            regression:
                "Chỉ duỗi tay hoặc chỉ duỗi chân.",

            progression:
                "Tăng thời gian giữ hoặc tăng số lần lặp.",

            stopCondition:
                "Dừng nếu đau lưng hoặc vai tăng.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },



        /* =================================================
           CARDIO
        ================================================== */

        mountainClimber: {

            exerciseId:
                "mountain-climber",

            name:
                "Mountain Climber",

            category:
                "Cardio / Core",

            target:
                "Tăng nhịp tim đồng thời rèn khả năng ổn định thân người.",

            sets:
                3,

            reps:
                "20–30 giây",

            durationSeconds:
                30,

            rest:
                "30–45 giây",

            restSeconds:
                30,

            rpe:
                "RPE 5–7",

            rir:
                "Giữ tốc độ còn kiểm soát được tư thế.",

            technique: [

                "Giữ vai trên tay.",

                "Giữ thân người ổn định.",

                "Đưa gối về trước có kiểm soát.",

                "Không cần chạy quá nhanh."

            ],

            mistakes: [

                "Hông bật lên xuống quá nhiều.",

                "Vai trượt quá xa khỏi tay.",

                "Cố tăng tốc khi kỹ thuật mất."

            ],

            regression:
                "Thực hiện chậm từng chân.",

            progression:
                "Tăng thời gian hoặc tốc độ từng bước nhỏ.",

            stopCondition:
                "Dừng nếu đau cổ tay, vai, lưng hoặc chóng mặt.",

            equipmentRequired:
                [],

            impact:
                "medium",

            timingMode:
                "time",

            videoAvailable:
                true

        },


        jumpingJack: {

            exerciseId:
                "jumping-jack",

            name:
                "Jumping Jack",

            category:
                "Cardio",

            target:
                "Tăng nhịp tim và phối hợp toàn thân.",

            sets:
                3,

            reps:
                "20–30 giây",

            durationSeconds:
                30,

            rest:
                "30–45 giây",

            restSeconds:
                30,

            rpe:
                "RPE 4–6",

            rir:
                "Duy trì nhịp độ có thể kiểm soát.",

            technique: [

                "Tiếp đất nhẹ.",

                "Giữ đầu gối cùng hướng bàn chân.",

                "Duy trì nhịp thở đều."

            ],

            mistakes: [

                "Tiếp đất quá mạnh.",

                "Cố tăng tốc khi mất kiểm soát.",

                "Nín thở."

            ],

            regression:
                "Step Jack không bật nhảy.",

            progression:
                "Tăng thời gian từng bước nhỏ.",

            stopCondition:
                "Dừng nếu đau khớp, chóng mặt hoặc khó thở bất thường.",

            equipmentRequired:
                [],

            impact:
                "medium",

            timingMode:
                "time",

            videoAvailable:
                true

        },


        highKnees: {

            exerciseId:
                "high-knees",

            name:
                "High Knees",

            category:
                "Cardio",

            target:
                "Tăng nhịp tim, phối hợp và khả năng vận động nhanh của chân.",

            sets:
                3,

            reps:
                "20–30 giây",

            durationSeconds:
                30,

            rest:
                "30–45 giây",

            restSeconds:
                30,

            rpe:
                "RPE 5–7",

            rir:
                "Giữ nhịp độ có thể kiểm soát.",

            technique: [

                "Giữ thân người tương đối thẳng.",

                "Tiếp đất nhẹ.",

                "Đánh tay tự nhiên.",

                "Không cần nâng gối quá cao nếu mất kiểm soát."

            ],

            mistakes: [

                "Ngả người quá nhiều.",

                "Tiếp đất nặng.",

                "Cố chạy quá nhanh."

            ],

            regression:
                "Marching High Knees không bật nhảy.",

            progression:
                "Tăng thời gian hoặc tốc độ từng bước nhỏ.",

            stopCondition:
                "Dừng nếu đau gối, cổ chân, chóng mặt hoặc khó thở bất thường.",

            equipmentRequired:
                [],

            impact:
                "medium",

            timingMode:
                "time",

            videoAvailable:
                true

        },


jumpRope: {

    exerciseId:
        "jump-rope",

    name:
        "Jump Rope",

    category:
        "Cardio",

    target:
        "Phát triển sức bền tim mạch, nhịp điệu và phối hợp.",

    sets:
        3,

    reps:
        "30–60 giây",

    durationSeconds:
        45,

    rest:
        "45–60 giây",

    restSeconds:
        45,

    rpe:
        "RPE 5–7",

    rir:
        "Giữ nhịp độ còn kiểm soát được kỹ thuật.",

    technique: [

        "Nhảy thấp vừa đủ để dây đi qua.",

        "Tiếp đất nhẹ bằng phần trước bàn chân.",

        "Xoay dây chủ yếu từ cổ tay.",

        "Giữ vai thư giãn."

    ],

    mistakes: [

        "Nhảy quá cao.",

        "Dùng cả cánh tay để quay dây.",

        "Tiếp đất quá mạnh."

    ],

    regression:
        "Nhảy mô phỏng không dây hoặc Step Jack.",

    progression:
        "Tăng thời gian trước khi tăng tốc độ.",

    stopCondition:
        "Dừng nếu đau cổ chân, gối, chóng mặt hoặc khó thở bất thường.",

    equipmentRequired: [
        "jump-rope"
    ],

    impact:
        "medium",

    timingMode:
        "time",

    videoAvailable:
        true

},


        burpee: {

            exerciseId:
                "burpee",

            name:
                "Burpee",

            category:
                "Cardio / Full Body",

            target:
                "Rèn sức bền toàn thân và khả năng chuyển đổi tư thế.",

            sets:
                3,

            reps:
                "6–10",

            rest:
                "60–90 giây",

            restSeconds:
                60,

            rpe:
                "RPE 6–8",

            rir:
                "Dừng trước khi tốc độ làm giảm rõ rệt kỹ thuật.",

            technique: [

                "Đặt tay xuống sàn có kiểm soát.",

                "Đưa chân ra sau mà không để lưng võng.",

                "Đứng lên ổn định trước khi lặp lại."

            ],

            mistakes: [

                "Rơi người xuống sàn quá nhanh.",

                "Võng lưng.",

                "Tiếp đất mất kiểm soát.",

                "Cố giữ tốc độ khi quá mệt."

            ],

            regression:
                "Step-back Burpee không bật nhảy.",

            progression:
                "Tăng reps hoặc giảm thời gian nghỉ từng bước nhỏ.",

            stopCondition:
                "Dừng nếu đau khớp, chóng mặt, khó thở bất thường hoặc mất kiểm soát kỹ thuật.",

            equipmentRequired:
                [],

            impact:
                "high",

            timingMode:
                "reps",

            videoAvailable:
                true

        },



        /* =================================================
           MOBILITY
        ================================================== */

        catCow: {

            exerciseId:
                "cat-cow",

            name:
                "Cat Cow",

            category:
                "Mobility",

            target:
                "Tạo chuyển động nhẹ nhàng cho cột sống và hỗ trợ nhận biết tư thế.",

            sets:
                2,

            reps:
                "6–10 nhịp",

            rest:
                "20–30 giây",

            restSeconds:
                20,

            rpe:
                "RPE 2–3",

            rir:
                "Không cần tập đến mệt.",

            technique: [

                "Di chuyển chậm theo nhịp thở.",

                "Không ép biên độ.",

                "Giữ vai và hông ổn định."

            ],

            mistakes: [

                "Ép cột sống quá mạnh.",

                "Di chuyển quá nhanh.",

                "Nín thở."

            ],

            regression:
                "Giảm biên độ chuyển động.",

            progression:
                "Tăng số nhịp chậm và có kiểm soát.",

            stopCondition:
                "Dừng nếu chuyển động làm đau tăng.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "reps",

            videoAvailable:
                true

        },


        fullBodyMobility: {

            exerciseId:
                "full-body-mobility",

            name:
                "Full Body Mobility",

            category:
                "Mobility",

            target:
                "Khởi động và cải thiện khả năng vận động toàn thân trong biên độ thoải mái.",

            sets:
                1,

            reps:
                "5 phút",

            durationSeconds:
                300,

            rest:
                "Không áp dụng",

            restSeconds:
                0,

            rpe:
                "RPE 2–4",

            rir:
                "Không cần tập đến mệt.",

            technique: [

                "Di chuyển chậm và có kiểm soát.",

                "Duy trì nhịp thở tự nhiên.",

                "Không ép vào biên độ gây đau."

            ],

            mistakes: [

                "Di chuyển quá nhanh.",

                "Ép biên độ.",

                "Bỏ qua cảm giác đau tăng."

            ],

            regression:
                "Giảm biên độ hoặc thời lượng.",

            progression:
                "Tăng thời lượng nhẹ khi cảm thấy thoải mái.",

            stopCondition:
                "Dừng nếu xuất hiện đau tăng, chóng mặt hoặc triệu chứng bất thường.",

            equipmentRequired:
                [],

            impact:
                "low",

            timingMode:
                "time",

            videoAvailable:
                true

        }

    };



    /* =====================================================
       3. ALIAS GIỮ TƯƠNG THÍCH CODE CŨ
    ====================================================== */

    exerciseLibrary.hipThrust =
        exerciseLibrary.gluteBridge;



    /* =====================================================
       4. BÀI CŨ GIỮ LẠI

       Không mất dữ liệu tốt cũ.
       Không ưu tiên trong interactive plan vì chưa có video.
    ====================================================== */

    exerciseLibrary.gobletSquat = {

        exerciseId:
            "goblet-squat",

        name:
            "Goblet Squat",

        category:
            "Knee dominant",

        target:
            "Phát triển sức mạnh chân, đặc biệt cơ đùi trước và mông, đồng thời củng cố mẫu chuyển động squat.",

        sets:
            3,

        reps:
            "8–12",

        rest:
            "75–90 giây",

        restSeconds:
            75,

        rpe:
            "RPE 6–7",

        rir:
            "Còn khoảng 3–4 lần lặp có thể thực hiện nếu buộc phải tiếp tục.",

        technique: [

            "Giữ tạ gần ngực.",

            "Đặt bàn chân ở vị trí tự nhiên và ổn định.",

            "Đầu gối di chuyển cùng hướng với mũi chân.",

            "Giữ bàn chân tiếp xúc ổn định với mặt đất.",

            "Chỉ hạ sâu đến mức vẫn kiểm soát tốt tư thế."

        ],

        mistakes: [

            "Gập lưng mạnh khi xuống.",

            "Đầu gối đổ vào trong.",

            "Mất thăng bằng ở bàn chân.",

            "Cố xuống quá sâu khi không còn kiểm soát."

        ],

        regression:
            "Bodyweight Squat hoặc Box Squat.",

        progression:
            "Tăng số lần lặp trong vùng 8–12 trước khi tăng tải.",

        stopCondition:
            "Dừng hoặc đổi bài nếu xuất hiện đau sắc, đau tăng dần, chóng mặt hoặc mất khả năng kiểm soát kỹ thuật.",

        equipmentRequired: [
            "dumbbell"
        ],

        impact:
            "low",

        timingMode:
            "reps",

        videoAvailable:
            false

    };


    exerciseLibrary.romanianDeadlift = {

        exerciseId:
            "romanian-deadlift",

        name:
            "Romanian Deadlift",

        category:
            "Hip dominant",

        target:
            "Phát triển chuỗi sau gồm mông, gân kheo và khả năng kiểm soát hip hinge.",

        sets:
            3,

        reps:
            "8–12",

        rest:
            "90–120 giây",

        restSeconds:
            90,

        rpe:
            "RPE 6–7",

        rir:
            "Còn khoảng 3 lần lặp.",

        technique: [

            "Giữ cột sống ở tư thế ổn định.",

            "Đẩy hông ra sau thay vì ngồi xổm.",

            "Giữ tải gần cơ thể.",

            "Hạ đến mức còn kiểm soát tốt tư thế."

        ],

        mistakes: [

            "Cong lưng khi hạ.",

            "Tạ đi xa khỏi cơ thể.",

            "Biến động tác thành squat.",

            "Hạ quá sâu dù lưng đã mất kiểm soát."

        ],

        regression:
            "Hip Hinge không tải.",

        progression:
            "Tăng reps trước, sau đó tăng tải nhỏ khi kỹ thuật ổn định.",

        stopCondition:
            "Dừng nếu xuất hiện đau sắc ở lưng, tê lan hoặc mất kiểm soát thân người.",

        equipmentRequired: [
            "dumbbell"
        ],

        impact:
            "low",

        timingMode:
            "reps",

        videoAvailable:
            false

    };


    exerciseLibrary.dumbbellPress = {

        exerciseId:
            "dumbbell-chest-press",

        name:
            "Dumbbell Chest Press",

        category:
            "Push",

        target:
            "Phát triển sức mạnh ngực, vai trước và tay sau.",

        sets:
            3,

        reps:
            "8–12",

        rest:
            "90 giây",

        restSeconds:
            90,

        rpe:
            "RPE 6–8",

        rir:
            "Khoảng 2–4 lần lặp dự phòng.",

        technique: [

            "Giữ vai ổn định trên ghế.",

            "Hạ tạ có kiểm soát.",

            "Giữ cổ tay tương đối trung tính.",

            "Đẩy lên mà không bật tạ."

        ],

        mistakes: [

            "Hạ tạ quá nhanh.",

            "Để vai trượt ra trước.",

            "Cổ tay gập nhiều.",

            "Chọn tải quá nặng."

        ],

        regression:
            "Knee Push Up hoặc Push Up.",

        progression:
            "Double progression trong vùng 8–12 reps.",

        stopCondition:
            "Dừng khi đau vai/ngực bất thường hoặc mất kiểm soát tải.",

        equipmentRequired: [
            "dumbbell"
        ],

        impact:
            "low",

        timingMode:
            "reps",

        videoAvailable:
            false

    };


    exerciseLibrary.latPulldown = {

        exerciseId:
            "lat-pulldown",

        name:
            "Lat Pulldown",

        category:
            "Pull",

        target:
            "Phát triển cơ xô, lưng trên và khả năng kéo dọc.",

        sets:
            3,

        reps:
            "8–12",

        rest:
            "75–90 giây",

        restSeconds:
            75,

        rpe:
            "RPE 6–8",

        rir:
            "Khoảng 2–4 lần lặp dự phòng.",

        technique: [

            "Giữ ngực ổn định.",

            "Kéo thanh về phần trên ngực.",

            "Không ngả người quá mức.",

            "Kiểm soát pha trở lại."

        ],

        mistakes: [

            "Kéo sau gáy.",

            "Dùng quán tính quá nhiều.",

            "Nhún vai.",

            "Thả thanh lên quá nhanh."

        ],

        regression:
            "Band Lat Pulldown.",

        progression:
            "Double progression trong vùng 8–12 reps.",

        stopCondition:
            "Dừng nếu đau vai hoặc cổ tăng.",

        equipmentRequired: [
            "machines"
        ],

        impact:
            "low",

        timingMode:
            "reps",

        videoAvailable:
            false

    };


    exerciseLibrary.briskWalk = {

        exerciseId:
            "brisk-walk",

        name:
            "Đi bộ nhanh",

        category:
            "Cardio",

        target:
            "Cải thiện nền tảng aerobic với mức tác động thấp.",

        sets:
            1,

        reps:
            "20–40 phút",

        durationSeconds:
            1200,

        rest:
            "Không áp dụng",

        restSeconds:
            0,

        rpe:
            "RPE 3–5",

        rir:
            "Có thể nói chuyện nhưng nhịp thở tăng nhẹ.",

        technique: [

            "Duy trì tốc độ có thể kiểm soát.",

            "Giữ tư thế tự nhiên.",

            "Không cần cố đạt tốc độ tối đa."

        ],

        mistakes: [

            "Tăng tốc quá nhanh khi chưa quen.",

            "Bỏ qua đau bất thường."

        ],

        regression:
            "Đi bộ chậm hơn hoặc chia thành các đoạn ngắn.",

        progression:
            "Tăng thời lượng trước khi tăng tốc độ.",

        stopCondition:
            "Dừng nếu đau ngực, chóng mặt, khó thở bất thường hoặc đau tăng.",

        equipmentRequired:
            [],

        impact:
            "low",

        timingMode:
            "time",

        videoAvailable:
            false

    };



    /* =====================================================
       5. EXERCISE GETTER

       Luôn clone để không sửa thư viện gốc.
    ====================================================== */

    function exercise(
        key,
        overrides = {}
    ) {

        const source =
            exerciseLibrary[
                key
            ];


        if (
            !source
        ) {

            return null;

        }


        return {

            ...clone(
                source
            ),

            ...overrides

        };

    }



    /* =====================================================
       6. CHỌN BÀI THEO PROFILE
    ====================================================== */

    function chooseSquat(
        profile
    ) {

        return exercise(
            "bodyweightSquat"
        );

    }


    function choosePush(
        profile
    ) {

        if (
            isBeginner(
                profile
            )
        ) {

            return exercise(
                "kneePushUp"
            );

        }


        return exercise(
            "pushUp"
        );

    }


    function choosePull(
        profile
    ) {

        if (
            hasEquipment(
                profile,
                "dumbbell"
            )
        ) {

            return exercise(
                "dumbbellRow"
            );

        }


        /*
            Bộ 20 video chưa có bài kéo bodyweight
            tương đương.

            Không giả Bird Dog thành bài Pull.
        */

        return null;

    }


    function chooseShoulderPress(
        profile
    ) {

        if (
            hasEquipment(
                profile,
                "dumbbell"
            )
        ) {

            return exercise(
                "shoulderPress"
            );

        }


        return null;

    }


    function chooseBicepsCurl(
        profile
    ) {

        if (
            hasEquipment(
                profile,
                "dumbbell"
            )
        ) {

            return exercise(
                "bicepsCurl"
            );

        }


        return null;

    }



    /* =====================================================
/* =====================================================
   7. CHỌN CARDIO
====================================================== */

function chooseCardioExercises(
    profile
) {

    /*
        Có injury flag:
        không tự động đưa bài bật nhảy / impact cao.
    */

    if (
        hasInjuryFlag(
            profile
        )
    ) {

        return uniqueExercises([

            exercise(
                "fullBodyMobility"
            ),

            exercise(
                "catCow"
            ),

            exercise(
                "birdDog"
            )

        ]);

    }


    /*
        Beginner:
        giảm timer xuống 20 giây.

        Chưa tự thêm Jump Rope cho beginner
        để giữ kế hoạch đơn giản và dễ kiểm soát.
    */

    if (
        isBeginner(
            profile
        )
    ) {

        return uniqueExercises([

            exercise(
                "jumpingJack",
                {
                    durationSeconds:
                        20,

                    reps:
                        "20 giây"
                }
            ),

            exercise(
                "mountainClimber",
                {
                    durationSeconds:
                        20,

                    reps:
                        "20 giây"
                }
            ),

            exercise(
                "highKnees",
                {
                    durationSeconds:
                        20,

                    reps:
                        "20 giây"
                }
            ),

            exercise(
                "deadBug"
            )

        ]);

    }


    const items = [

        exercise(
            "jumpingJack"
        ),

        exercise(
            "mountainClimber"
        ),

        exercise(
            "highKnees"
        )

    ];


    /*
        Chỉ thêm Jump Rope khi người dùng
        thật sự khai báo có dây nhảy.
    */

    if (
        hasEquipment(
            profile,
            "jump-rope"
        )
    ) {

        items.push(

            exercise(
                "jumpRope"
            )

        );

    }


    /*
        Burpee chỉ tự thêm cho advanced.
    */

    if (
        profile
            ?.training
            ?.experience

        ===

        "advanced"
    ) {

        items.push(

            exercise(
                "burpee"
            )

        );

    }


    return uniqueExercises(
        items
    );

}

    /* =====================================================
       8. FULL BODY
    ====================================================== */

    function createFullBodySession(
        profile,
        name = "Full Body",
        variant = "A"
    ) {

        let exercises;


        if (
            variant ===
            "B"
        ) {

            exercises = [

                exercise(
                    "reverseLunge"
                ),

                exercise(
                    "gluteBridge"
                ),

                choosePush(
                    profile
                ),

                choosePull(
                    profile
                )
                ||
                exercise(
                    "birdDog"
                ),

                exercise(
                    "deadBug"
                )

            ];

        }


        else if (
            variant ===
            "C"
        ) {

            exercises = [

                exercise(
                    "forwardLunge"
                ),

                exercise(
                    "gluteBridge"
                ),

                choosePush(
                    profile
                ),

                choosePull(
                    profile
                )
                ||
                exercise(
                    "birdDog"
                ),

                exercise(
                    "sidePlank"
                )

            ];

        }


        else {

            exercises = [

                chooseSquat(
                    profile
                ),

                exercise(
                    "gluteBridge"
                ),

                choosePush(
                    profile
                ),

                choosePull(
                    profile
                )
                ||
                exercise(
                    "birdDog"
                ),

                exercise(
                    "plank"
                )

            ];

        }


        return {

            sessionId:
                `full-body-${String(
                    variant
                ).toLowerCase()}`,

            name:
                name,

            type:
                "Strength",

            duration:

                Number(
                    profile
                        ?.training
                        ?.duration
                )

                ||

                45,

            warmup: [

                "5–8 phút vận động nhẹ.",

                "Mobility nhẹ cho hông, vai và cột sống ngực.",

                "Thực hiện vài lần lặp khởi động trước bài chính."

            ],

            exercises:
                uniqueExercises(
                    exercises
                ),

            cooldown: [

                "3–5 phút đi lại hoặc thả lỏng nhẹ.",

                "Thở chậm để hạ nhịp.",

                "Mobility nhẹ nếu cảm thấy dễ chịu."

            ]

        };

    }



    /* =====================================================
       9. UPPER BODY
    ====================================================== */

    function createUpperSession(
        profile,
        variant = "A"
    ) {

        const exercises = [

            choosePush(
                profile
            ),

            choosePull(
                profile
            ),

            chooseShoulderPress(
                profile
            ),

            chooseBicepsCurl(
                profile
            ),

            variant ===
            "B"

                ? exercise(
                    "birdDog"
                )

                : exercise(
                    "deadBug"
                )

        ];


        /*
            Không có Dumbbell:
            không nhét bài Dumbbell vào.

            Bổ sung core thay vì giả bài Pull.
        */

        if (
            !hasEquipment(
                profile,
                "dumbbell"
            )
        ) {

            exercises.push(

                exercise(
                    "sidePlank"
                )

            );

        }


        return {

            sessionId:
                `upper-body-${String(
                    variant
                ).toLowerCase()}`,

            name:

                variant ===
                "B"

                    ? "Upper Body B"

                    : "Upper Body A",

            type:
                "Strength",

            duration:

                Number(
                    profile
                        ?.training
                        ?.duration
                )

                ||

                45,

            warmup: [

                "5 phút vận động nhẹ.",

                "Xoay vai có kiểm soát.",

                "Mobility vai và cột sống ngực.",

                "Thực hiện vài lần lặp khởi động trước bài chính."

            ],

            exercises:
                uniqueExercises(
                    exercises
                ),

            cooldown: [

                "Đi bộ hoặc thả lỏng 3–5 phút.",

                "Mobility vai nhẹ nếu cảm thấy phù hợp."

            ]

        };

    }



    /* =====================================================
       10. LOWER BODY
    ====================================================== */

    function createLowerSession(
        profile,
        variant = "A"
    ) {

        const exercises =

            variant ===
            "B"

                ? [

                    exercise(
                        "bodyweightSquat"
                    ),

                    exercise(
                        "forwardLunge"
                    ),

                    exercise(
                        "gluteBridge"
                    ),

                    exercise(
                        "sidePlank"
                    ),

                    exercise(
                        "catCow"
                    )

                ]

                : [

                    exercise(
                        "bodyweightSquat"
                    ),

                    exercise(
                        "reverseLunge"
                    ),

                    exercise(
                        "gluteBridge"
                    ),

                    exercise(
                        "plank"
                    ),

                    exercise(
                        "birdDog"
                    )

                ];


        return {

            sessionId:
                `lower-body-${String(
                    variant
                ).toLowerCase()}`,

            name:

                variant ===
                "B"

                    ? "Lower Body B"

                    : "Lower Body A",

            type:
                "Strength",

            duration:

                Number(
                    profile
                        ?.training
                        ?.duration
                )

                ||

                45,

            warmup: [

                "5–8 phút vận động nhẹ.",

                "Bodyweight Squat nhẹ.",

                "Mobility cổ chân và hông trong biên độ thoải mái."

            ],

            exercises:
                uniqueExercises(
                    exercises
                ),

            cooldown: [

                "Đi bộ nhẹ.",

                "Mobility nhẹ vùng chân nếu cảm thấy phù hợp."

            ]

        };

    }



    /* =====================================================
       11. CARDIO SESSION
    ====================================================== */

    function createCardioSession(
        profile
    ) {

        const beginner =
            isBeginner(
                profile
            );


        const injury =
            hasInjuryFlag(
                profile
            );


        return {

            sessionId:

                injury

                    ? "active-recovery"

                    : "cardio-foundation",

            name:

                injury

                    ? "Vận động phục hồi nhẹ"

                    : "Cardio nền tảng",

            type:

                injury

                    ? "Mobility"

                    : "Cardio",

            duration:

                injury

                    ? 20

                    : beginner

                        ? 25

                        : 35,

            intensity:

                injury

                    ? "RPE 2–4"

                    : beginner

                        ? "RPE 3–4"

                        : "RPE 4–6",

            talkTest:

                injury

                    ? "Giữ mức vận động nhẹ, không cố tạo mệt."

                    : "Bạn vẫn có thể nói được nhưng hơi thở tăng so với khi nghỉ.",

            exercises:
                chooseCardioExercises(
                    profile
                ),

            progression:

                injury

                    ? "Không tự tăng cường độ khi đang có chấn thương hoặc đau hạn chế vận động."

                    : "Ưu tiên tăng thời lượng từng bước nhỏ trước khi tăng cường độ."

        };

    }



    /* =====================================================
       12. MOBILITY SESSION
    ====================================================== */

    function createMobilitySession(
        profile
    ) {

        return {

            sessionId:
                "mobility-session",

            name:
                "Mobility & Core nhẹ",

            type:
                "Mobility",

            duration:
                20,

            intensity:
                "RPE 2–4",

            exercises:
                uniqueExercises([

                    exercise(
                        "fullBodyMobility"
                    ),

                    exercise(
                        "catCow"
                    ),

                    exercise(
                        "birdDog"
                    ),

                    exercise(
                        "deadBug"
                    )

                ]),

            progression:
                "Ưu tiên chất lượng chuyển động, không cần tập đến mệt."

        };

    }



    /* =====================================================
       13. REST DAY
    ====================================================== */

    function createRestDay() {

        return {

            sessionId:
                "recovery-day",

            name:
                "Phục hồi",

            type:
                "Recovery",

            recommendations: [

                "Đi bộ nhẹ nếu cảm thấy thoải mái.",

                "Không cần cố đạt cường độ cao.",

                "Ưu tiên giấc ngủ và dinh dưỡng.",

                "Có thể thực hiện mobility nhẹ 10–15 phút."

            ]

        };

    }



    /* =====================================================
       14. CHIẾN LƯỢC TẬP
    ====================================================== */

    function createStrategy(
        profile
    ) {

        const days =
            getTrainingDays(
                profile
            );


        const experience =
            profile
                ?.training
                ?.experience;


        let split;


        if (
            days <= 3
        ) {

            split =
                "Full Body";

        }


        else if (
            days === 4
        ) {

            split =
                "Upper / Lower";

        }


        else {

            split =
                "Upper / Lower kết hợp Full Body và cardio";

        }


        let reason =
            "";


        if (
            experience ===
            "beginner"
        ) {

            reason =
                "Bạn đang ở mức người mới hoặc mới quay lại tập luyện. Chương trình ưu tiên các mẫu vận động cơ bản, kỹ thuật và khả năng phục hồi.";

        }


        else {

            reason =
                `Bạn có thể bố trí ${days} buổi mỗi tuần. Cách chia ${split} giúp phân bổ khối lượng tập và khoảng phục hồi giữa các buổi.`;

        }


        /*
            Giải thích việc không dùng Dumbbell.
        */

        if (
            !hasEquipment(
                profile,
                "dumbbell"
            )
        ) {

            reason +=
                " Hồ sơ hiện không có tạ đơn, vì vậy kế hoạch tương tác không tự đưa các bài Dumbbell vào lịch.";

        }


        /*
            Injury caution.
        */

        if (
            hasInjuryFlag(
                profile
            )
        ) {

            reason +=
                " Hồ sơ có đánh dấu chấn thương hoặc đau hạn chế vận động, vì vậy cardio tác động cao không được tự động ưu tiên.";

        }


        return {

            weeklySessions:
                days,

            split:
                split,

            reason:
                reason,

            progression:
                "Sử dụng double progression. Trước tiên tăng số lần lặp trong vùng quy định. Khi đạt đầu trên của rep range ở tất cả hiệp, kỹ thuật tốt và RPE vẫn phù hợp, mới tăng độ khó hoặc tải ở mức nhỏ.",

            recoveryRule:
                "Không tăng đồng thời tải, reps, sets và cardio trong cùng một lần điều chỉnh.",

            beginnerIntensity:
                "Phần lớn hiệp tập giữ khoảng RPE 6–8 thay vì liên tục tập đến thất bại.",

            videoReady:
                true

        };

    }



    /* =====================================================
       15. TẠO DANH SÁCH BUỔI TẬP
    ====================================================== */

    function createTrainingSessions(
        profile
    ) {

        const days =
            getTrainingDays(
                profile
            );


        const goal =
            profile
                ?.goal
                ?.primary;



        /* =========================
           1 BUỔI
        ========================== */

        if (
            days === 1
        ) {

            return [

                createFullBodySession(
                    profile,
                    "Full Body A",
                    "A"
                )

            ];

        }



        /* =========================
           2 BUỔI
        ========================== */

        if (
            days === 2
        ) {

            return [

                createFullBodySession(
                    profile,
                    "Full Body A",
                    "A"
                ),

                createFullBodySession(
                    profile,
                    "Full Body B",
                    "B"
                )

            ];

        }



        /* =========================
           3 BUỔI
        ========================== */

        if (
            days === 3
        ) {

            return [

                createFullBodySession(
                    profile,
                    "Full Body A",
                    "A"
                ),


                goal ===
                "endurance"

                    ? createCardioSession(
                        profile
                    )

                    : createFullBodySession(
                        profile,
                        "Full Body B",
                        "B"
                    ),


                createFullBodySession(
                    profile,
                    "Full Body C",
                    "C"
                )

            ];

        }



        /* =========================
           4 BUỔI
        ========================== */

        if (
            days === 4
        ) {

            return [

                createUpperSession(
                    profile,
                    "A"
                ),

                createLowerSession(
                    profile,
                    "A"
                ),

                createUpperSession(
                    profile,
                    "B"
                ),

                createLowerSession(
                    profile,
                    "B"
                )

            ];

        }



        /* =========================
           5–6 BUỔI
        ========================== */

        const sessions = [

            createUpperSession(
                profile,
                "A"
            ),

            createLowerSession(
                profile,
                "A"
            ),

            createFullBodySession(
                profile,
                "Full Body",
                "A"
            ),

            createUpperSession(
                profile,
                "B"
            ),

            createLowerSession(
                profile,
                "B"
            )

        ];


        /*
            Buổi thứ 6:
            Mobility nếu goal mobility,
            còn lại dùng cardio.
        */

        if (
            days >= 6
        ) {

            sessions.push(

                goal ===
                "mobility"

                    ? createMobilitySession(
                        profile
                    )

                    : createCardioSession(
                        profile
                    )

            );

        }


        return sessions;

    }



    /* =====================================================
       16. SINH LỊCH 7 NGÀY
    ====================================================== */

    function createWeeklySchedule(
        profile
    ) {

        const days =
            getTrainingDays(
                profile
            );


        const trainingSessions =
            createTrainingSessions(
                profile
            );


        /*
            Mặc định cả tuần là Recovery.
        */

        const week =
            Array.from(

                {
                    length:
                        7
                },

                () =>
                    createRestDay()

            );


        /*
            Index:

            0 = Thứ Hai
            1 = Thứ Ba
            2 = Thứ Tư
            3 = Thứ Năm
            4 = Thứ Sáu
            5 = Thứ Bảy
            6 = Chủ Nhật
        */

        const preferredSlots = {

            1: [
                2
            ],

            2: [
                1,
                4
            ],

            3: [
                0,
                2,
                4
            ],

            4: [
                0,
                1,
                3,
                4
            ],

            5: [
                0,
                1,
                2,
                4,
                5
            ],

            6: [
                0,
                1,
                2,
                3,
                4,
                5
            ]

        };


        const slots =

            preferredSlots[
                days
            ]

            ||

            preferredSlots[3];


        trainingSessions
            .forEach(

                (
                    session,
                    index
                ) => {

                    if (
                        slots[
                            index
                        ]
                        !==
                        undefined
                    ) {

                        week[
                            slots[
                                index
                            ]
                        ] =
                            session;

                    }

                }

            );


        return week;

    }



    /* =====================================================
       17. ĐIỀU CHỈNH THEO PHỤC HỒI

       Giữ logic cũ.
    ====================================================== */

    function recoveryAdjustment(
        profile
    ) {

        const recovery =
            profile
                ?.recovery
            ||
            {};


        const sleepHours =
            Number(
                recovery.sleepHours ||
                0
            );


        const fatigue =
            Number(
                recovery.fatigue ||
                0
            );


        const energy =
            Number(
                recovery.energy ||
                0
            );


        const stress =
            Number(
                recovery.stress ||
                0
            );


        if (
            sleepHours < 6 ||
            fatigue >= 8 ||
            energy <= 3
        ) {

            return {

                level:
                    "reduce",

                message:
                    "Dữ liệu phục hồi hiện cho thấy khả năng chịu tải có thể thấp hơn bình thường. Trong tuần đầu nên giảm khoảng 10–20% tổng volume hoặc giữ tải nhẹ hơn và ưu tiên kỹ thuật."

            };

        }


        if (
            sleepHours < 7 ||
            stress >= 7 ||
            fatigue >= 6
        ) {

            return {

                level:
                    "caution",

                message:
                    "Khả năng phục hồi ở mức cần theo dõi. Không nên tăng đồng thời nhiều biến tập luyện trong tuần này."

            };

        }


        return {

            level:
                "normal",

            message:
                "Dữ liệu phục hồi hiện không cho thấy lý do rõ ràng cần giảm volume ngay từ đầu."

        };

    }



    /* =====================================================
       18. ÁP DỤNG RECOVERY VÀO LỊCH

       Chỉ level reduce:
       giảm 1 set, tối thiểu còn 1 set.

       Không sửa thư viện gốc.
    ====================================================== */

    function applyRecoveryToSchedule(
        schedule,
        recovery
    ) {

        const result =
            clone(
                schedule
            );


        if (
            recovery
                ?.level

            !==

            "reduce"
        ) {

            return result;

        }


        result
            .forEach(

                session => {

                    if (
                        !Array.isArray(
                            session
                                ?.exercises
                        )
                    ) {

                        return;

                    }


                    session.exercises =

                        session
                            .exercises

                            .map(

                                item => {

                                    const sets =
                                        Number(
                                            item.sets
                                        );


                                    if (
                                        Number.isFinite(
                                            sets
                                        )
                                        &&
                                        sets > 1
                                    ) {

                                        return {

                                            ...item,

                                            sets:
                                                sets - 1,

                                            recoveryAdjusted:
                                                true

                                        };

                                    }


                                    return item;

                                }

                            );

                }

            );


        return result;

    }



    /* =====================================================
       19. VALIDATE VIDEO-READY PLAN

       Chỉ cảnh báo.
       Không làm website dừng.
    ====================================================== */

    function validateSchedule(
        schedule
    ) {

        const warnings =
            [];


        schedule
            .forEach(

                (
                    session,
                    dayIndex
                ) => {

                    if (
                        !Array.isArray(
                            session
                                ?.exercises
                        )
                    ) {

                        return;

                    }


                    session
                        .exercises
                        .forEach(

                            item => {

                                if (
                                    !item.exerciseId
                                ) {

                                    warnings.push(

                                        `Ngày ${dayIndex + 1}: ${item.name || "Bài tập"} thiếu exerciseId.`

                                    );

                                }


                                if (
                                    !Number.isFinite(

                                        Number(
                                            item.restSeconds
                                        )

                                    )
                                ) {

                                    warnings.push(

                                        `Ngày ${dayIndex + 1}: ${item.name || "Bài tập"} thiếu restSeconds.`

                                    );

                                }

                            }

                        );

                }

            );


        return {

            valid:
                warnings.length === 0,

            warnings:
                warnings

        };

    }



    /* =====================================================
       20. RUN WORKOUT ENGINE
    ====================================================== */

    function run(
        profile,
        healthResult
    ) {

        if (
            !profile
        ) {

            return {

                success:
                    false,

                error:
                    "Không có hồ sơ người dùng."

            };

        }



        /* =========================
           SAFETY GATE
        ========================== */

        if (
            healthResult &&
            healthResult.safety &&
            healthResult.safety
                .allowFullAutomation
                === false
        ) {

            return {

                success:
                    false,

                blocked:
                    true,

                reason:
                    healthResult
                        .safety
                        .message,

                schedule:
                    []

            };

        }



        /* =========================
           STRATEGY
        ========================== */

        const strategy =
            createStrategy(
                profile
            );



        /* =========================
           RECOVERY
        ========================== */

        const recovery =
            recoveryAdjustment(
                profile
            );



        /* =========================
           WEEK
        ========================== */

        const baseSchedule =
            createWeeklySchedule(
                profile
            );


        const weeklySchedule =
            applyRecoveryToSchedule(
                baseSchedule,
                recovery
            );



        /* =========================
           VALIDATION
        ========================== */

        const validation =
            validateSchedule(
                weeklySchedule
            );



        /* =========================
           RESULT
        ========================== */

        return {

            success:
                true,

            engine:
                "SportHub Workout Engine v2.0",

            strategy:
                strategy,

            recoveryAdjustment:
                recovery,

            schedule:
                weeklySchedule,

            validation:
                validation,

            rules: {

                rpeExplanation: {

                    6:
                        "Còn khoảng 4 lần lặp có thể thực hiện.",

                    7:
                        "Còn khoảng 3 lần lặp.",

                    8:
                        "Còn khoảng 2 lần lặp."

                },

                progression:
                    "Double progression",

                failureTraining:
                    false,

                painRule:
                    "Đau sắc, đau tăng nhanh, tê lan hoặc triệu chứng bất thường là tín hiệu dừng và đánh giá lại.",

                interactiveVideoPlan:
                    true,

                missingEquipmentRule:
                    "Không tự động đề xuất bài Dumbbell trong kế hoạch tương tác nếu hồ sơ không có tạ đơn.",

                recoveryAutoReduction:
                    true

            }

        };

    }



    /* =====================================================
       21. PUBLIC API

       GIỮ API CŨ
       + bổ sung API mới.
    ====================================================== */

    return {

        /* =========================
           API CŨ
        ========================== */

        run:
            run,

        library:
            exerciseLibrary,

        createStrategy:
            createStrategy,

        createWeeklySchedule:
            createWeeklySchedule,

        recoveryAdjustment:
            recoveryAdjustment,


        /* =========================
           API MỚI
        ========================== */

        createTrainingSessions:
            createTrainingSessions,

        createFullBodySession:
            createFullBodySession,

        createUpperSession:
            createUpperSession,

        createLowerSession:
            createLowerSession,

        createCardioSession:
            createCardioSession,

        createMobilitySession:
            createMobilitySession,

        validateSchedule:
            validateSchedule

    };

})();