import { type Component, type Accessor, type Setter, createSignal, createEffect } from "solid-js";

export const People: Component<{
    numOfPeople: Accessor<number>;
    setNumOfPeople: Setter<number>;
    numOfLions: Accessor<number>;
    setNumOfLions: Setter<number>;
    start: Accessor<boolean>;
    setStart: Setter<boolean>;

    numOfFood: Accessor<number>;
    setNumOfFood: Setter<number>;
    speed: Accessor<number>;
    setSpeed: Setter<number>;
    canLionsStarve: Accessor<boolean>;
    setStats: Setter<{
        numDeadLions: number;
        numberDeadPeople: number;
        weeks: number;
        foodConsumed: number;
        poisonConsumed: number;
    }>;
    stats: Accessor<{
        numDeadLions: number;
        numberDeadPeople: number;
        weeks: number;
        foodConsumed: number;
        poisonConsumed: number;
    }>;
}> = (props) => {
    const [numOfPeople, setNumOfPeople] = createSignal(props.numOfPeople());
    const [numOfLions, setNumOfLions] = createSignal(props.numOfLions());
    const [numOfFood, setNumOfFood] = createSignal(props.numOfFood());
    const [Speed, setSpeed] = createSignal(props.speed());

    const getBools = (arrayLength, numFalsys) => {
        const booleans = Array(arrayLength).fill(true);
        booleans.fill(false, 0, arrayLength - numFalsys); // Fill the rest with true
        for (let i = arrayLength - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [booleans[i], booleans[j]] = [booleans[j], booleans[i]]; // Swap elements
        }

        return booleans.slice(0, arrayLength);
    };

    function context2d(width, height, dpi) {
        if (dpi == null) dpi = devicePixelRatio;
        var canvas = document.createElement("canvas");
        canvas.width = width * dpi;
        canvas.height = height * dpi;
        canvas.style.width = width + "px";
        var context = canvas.getContext("2d");
        context.scale(dpi, dpi);
        return context;
    }

    const height = 910;
    const width = 1100;
    const n = numOfPeople(); // number of persons
    const m = 10; // tail length
    const context = context2d(width, height, 1);
    context.lineJoin = "round";
    context.lineCap = "round";

    let people = new Array(n).fill(Math.random() * width).map(() => ({
        vx: (Math.random() - 0.5) * Speed(),
        vy: (Math.random() - 0.5) * Speed(),
        px: new Array(m).fill(Math.random() * width),
        py: new Array(m).fill(Math.random() * height),
        v: (Math.random() - 0.5) * Speed(),
        count: 0,
        strenght: 5,
    }));

    let bools = getBools(numOfFood(), Math.round(numOfFood() * 0.3));
    let food = new Array(numOfFood()).fill(Math.random() * width).map(() => ({
        value: (Math.random() - 0.5) * Speed(),
        px: Math.random() * width,
        py: Math.random() * height,
        poison: Math.random() < 0.5,
    }));

    for (let index = 0; index < food.length; index++) {
        food[index].poison = bools[index];
    }

    let lions = new Array(numOfLions()).fill(Math.random() * width).map(() => ({
        value: (Math.random() - 0.5) * Speed(),
        vx: (Math.random() - 0.5) * Speed(),
        vy: (Math.random() - 0.5) * Speed(),
        px: new Array(m).fill(Math.random() * width),
        py: new Array(m).fill(Math.random() * height),
        strenght: (Math.random() + 0.5) * 10,
    }));

    function isInRange(number, center, range) {
        return Math.abs(number - center) <= range;
    }

    createEffect(() => {
        if (props.start()) {
            props.setStart(false);
            setNumOfPeople(props.numOfPeople());
            setNumOfLions(props.numOfLions());
            setNumOfFood(props.numOfFood());
            setSpeed(props.speed());

            people = new Array(n).fill(Math.random() * width).map(() => ({
                vx: (Math.random() - 0.5) * Speed(),
                vy: (Math.random() - 0.5) * Speed(),
                px: new Array(m).fill(Math.random() * width),
                py: new Array(m).fill(Math.random() * height),
                v: (Math.random() - 0.5) * Speed(),
                count: 0,
                strenght: 6,
            }));

            food = new Array(numOfFood()).fill(Math.random() * width).map(() => ({
                value: (Math.random() - 0.5) * Speed(),
                px: Math.random() * width,
                py: Math.random() * height,
                poison: Math.random() < 0.5,
            }));
            for (let index = 0; index < food.length; index++) {
                food[index].poison = bools[index];
            }

            lions = new Array(numOfLions()).fill(Math.random() * width).map(() => ({
                value: (Math.random() - 0.5) * Speed(),
                vx: (Math.random() - 0.3) * Speed(),
                vy: (Math.random() - 0.3) * Speed(),
                px: new Array(m).fill(Math.random() * width),
                py: new Array(m).fill(Math.random() * height),
                strenght: (Math.random() - 0.5) * Speed(),
            }));
        }
    }, [props.start]);

    function star(ctx, R, X, Y, N) {
        ctx.beginPath();
        ctx.moveTo(X + R, Y);
        for (var i = 1; i <= N * 2; i++) {
            if (i % 2 == 0) {
                var theta = (i * (Math.PI * 2)) / (N * 2);
                var x = X + R * Math.cos(theta);
                var y = Y + R * Math.sin(theta);
            } else {
                var theta = (i * (Math.PI * 2)) / (N * 2);
                var x = X + (R / 2) * Math.cos(theta);
                var y = Y + (R / 2) * Math.sin(theta);
            }
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.fillStyle = "green";
        ctx.stroke();
    }

    const animate = () => {
        context.clearRect(0, 0, width, height);
        for (const f of food) {
            context.save();
            context.translate(f.px, f.py);
            context.beginPath();
            context.ellipse(0, 0, 3, 3, 0, 0, 2 * Math.PI);
            if (f.poison) {
                context.fillStyle = "red";
            } else {
                context.fillStyle = "green";
            }
            context.fill();
            context.restore();
        }

        for (const lion of lions) {
            context.save();
            context.translate(lion.px[0], lion.py[0]);
            context.beginPath();
            context.ellipse(0, 0, 5, 5, 0, 0, 2 * Math.PI);
            context.fillStyle = "yellow";
            context.fill();
            context.restore();

            let dx = lion.vx;
            let dy = lion.vy;
            let x = (lion.px[0] += dx);
            let y = (lion.py[0] += dy);
            let speed = Math.sqrt(dx * dx + dy * dy);
            const count = speed * 5;
            const k1 = -5 - speed / 3;

            // Bounce off the walls.
            if (x < 0 || x > width) lion.vx *= -1;
            if (y < 0 || y > height) lion.vy *= -1;

            // Swim!
            for (var j = 1; j < m; ++j) {
                const vx = x - lion.px[j];
                const vy = y - lion.py[j];
                const k2 = Math.sin((count + j * 3) / 300) / speed;
                lion.px[j] = (x += (dx / speed) * k1) - dy * k2;
                lion.py[j] = (y += (dy / speed) * k1) + dx * k2;
                speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
            }

            // Head
            context.save();
            context.translate(lion.px[0], lion.py[0]);
            context.rotate(Math.atan2(lion.vy, lion.vx));
            context.beginPath();
            context.ellipse(0, 0, 8, 5, 0, 0, 2 * Math.PI);
            context.fill();
            context.restore();
        }

        for (const person of people) {
            let dx = person.vx;
            let dy = person.vy;
            let x = (person.px[0] += dx);
            let y = (person.py[0] += dy);
            let speed = Math.sqrt(dx * dx + dy * dy);
            // const count = speed * 10;
            const count = speed * person.strenght;
            const k1 = -5 - speed / 3;

            // Bounce off the walls.
            if (x < 0 || x > width) person.vx *= -1;
            if (y < 0 || y > height) person.vy *= -1;

            // Swim!
            for (var j = 1; j < m; ++j) {
                const vx = x - person.px[j];
                const vy = y - person.py[j];
                const k2 = Math.sin(((person.count += count) + j * 3) / 300) / speed;
                person.px[j] = (x += (dx / speed) * k1) - dy * k2;
                person.py[j] = (y += (dy / speed) * k1) + dx * k2;
                speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
            }

            // Head
            context.save();
            context.translate(person.px[0], person.py[0]);
            context.rotate(Math.atan2(person.vy, person.vx));
            context.beginPath();
            context.ellipse(0, 0, person.strenght, person.strenght / 2, 0, 0, 2 * Math.PI);
            context.fill();
            context.restore();

            for (let index = 0; index < lions.length; index++) {
                const lion = lions[index];
                if (
                    isInRange(Math.round(x), Math.round(lion.px[0]), 3) &&
                    isInRange(Math.round(y), Math.round(lion.py[0]), 3)
                ) {
                    person.strenght -= 1;
                    if (person.strenght < 0) {
                        people.splice(people.indexOf(person), 1);
                        props.setStats({
                            ...props.stats(),
                            numberDeadPeople: props.stats().numberDeadPeople + 1,
                        });
                    }
                    lion.strenght += 1;
                    lions[index] = lion;
                }
            }

            // Body
            context.beginPath();
            context.moveTo(person.px[0], person.py[0]);
            for (let i = 1; i < 3; ++i) context.lineTo(person.px[i], person.py[i]);
            context.lineWidth = 4;
            context.stroke();

            // Tail
            context.beginPath();
            context.moveTo(person.px[0], person.py[0]);
            for (let i = 1; i < m; ++i) context.lineTo(person.px[i], person.py[i]);
            context.lineWidth = 1;
            context.stroke();

            // sim
            for (let index = 0; index < food.length; index++) {
                const fd = food[index];
                if (isInRange(Math.round(x), Math.round(fd.px), 3) && isInRange(Math.round(y), Math.round(fd.py), 3)) {
                    food.splice(index, 1);
                    if (fd.poison) {
                        person.vx -= 0.5;
                        person.vy -= 0.5;
                        person.strenght -= 1;
                        props.setStats({
                            ...props.stats(),
                            poisonConsumed: props.stats().poisonConsumed + 1,
                        });
                    } else {
                        person.vx += 0.5;
                        person.vy += 0.5;
                        person.strenght += 1;
                        props.setStats({
                            ...props.stats(),
                            foodConsumed: props.stats().foodConsumed + 1,
                        });
                    }
                    if (speed < 0 || person.strenght <= 0) {
                        people.splice(people.indexOf(person), 1);
                        props.setStats({
                            ...props.stats(),
                            numberDeadPeople: props.stats().numberDeadPeople + 1,
                        });
                    }

                    if (food.length <= 5) {
                        food = new Array(numOfFood()).fill(Math.random() * width).map(() => ({
                            value: (Math.random() - 0.5) * Speed(),
                            px: Math.random() * width,
                            py: Math.random() * height,
                            poison: Math.random() < 0.5,
                        }));
                        props.setStats({
                            ...props.stats(),
                            weeks: props.stats().weeks + 1,
                        });

                        if (props.canLionsStarve()) {
                            for (const lion of lions) {
                                lion.strenght -= 50;
                                if (lion.strenght < 2) {
                                    lions.splice(lions.indexOf(lion), 1);
                                    props.setStats({
                                        ...props.stats(),
                                        numDeadLions: props.stats().numDeadLions + 1,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    setInterval(animate, 20);

    return <div>{context.canvas}</div>;
};
