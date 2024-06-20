import { createSignal, type Component } from "solid-js";
import { Gears, People, PolarClock } from "./components";

import styles from "./App.module.css";

const App: Component = () => {
    const [numOfPeople, setNumOfPeople] = createSignal(50);
    const [numOfLions, setNumOfLions] = createSignal(20);
    const [numOfFood, setNumOfFood] = createSignal(100);
    const [speed, setSpeed] = createSignal(2);
    const [start, setStart] = createSignal(false);
    const [canLionsStarve, starveLions] = createSignal(false);
    const [simStarted, setSimStart] = createSignal(false);
    const [stats, setStats] = createSignal({
        numDeadLions: 0,
        numberDeadPeople: 0,
        weeks: 1,
        foodConsumed: 0,
        poisonConsumed: 0,
    });

    const handleRestart = () => {
        setStart(true);
        setSimStart(true);
        setStats({
            numDeadLions: 0,
            numberDeadPeople: 0,
            weeks: 1,
            foodConsumed: 0,
            poisonConsumed: 0,
        });
    };

    return (
        <div class={styles.Container}>
            <div class={styles.col1}>
                <div class={styles.row1}>
                    <div class={styles.stat1}>
                        <div style={"height: 100%; flex-basis: 30%; padding-top: 80px"}>
                            <b>Game Settings</b>
                        </div>
                        <div style={"height: 100%; flex-basis: 70%;"}>
                            <div style={"padding-top: 20px"}>
                                <div>
                                    <label for="scales">
                                        Number of Food items: <b>{numOfFood()}</b>
                                    </label>
                                    <input
                                        class={styles.slider}
                                        type="range"
                                        min="50"
                                        max="200"
                                        value={numOfFood()}
                                        id="myRange"
                                        onChange={(e) => setNumOfFood(Number(e.currentTarget.value))}
                                    ></input>
                                </div>

                                <label for="scales">
                                    Number of People: <b>{numOfPeople()}</b>
                                </label>
                                <input
                                    class={styles.slider}
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={numOfPeople()}
                                    id="myRange"
                                    onChange={(e) => setNumOfPeople(Number(e.currentTarget.value))}
                                ></input>
                            </div>

                            <div>
                                <label for="scales">
                                    Number of Lions: <b>{numOfLions()}</b>
                                </label>
                                <input
                                    class={styles.slider}
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={numOfLions()}
                                    id="myRange"
                                    onChange={(e) => setNumOfLions(Number(e.currentTarget.value))}
                                ></input>
                            </div>

                            <div>
                                <label for="scales">
                                    Speed of People: <b>{speed()}</b>
                                </label>
                                <input
                                    class={styles.slider}
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={speed()}
                                    id="myRange"
                                    onChange={(e) => setSpeed(Number(e.currentTarget.value))}
                                ></input>
                            </div>

                            <div style={"padding-top: 10px"}>
                                <input
                                    type="checkbox"
                                    id="starve_lions"
                                    name="scales"
                                    checked={canLionsStarve()}
                                    onClick={() => starveLions(!canLionsStarve())}
                                />
                                <label for="starve_lions">Can Lions Starve?</label>
                            </div>
                            <button class={styles.button} onClick={() => handleRestart()}>
                                {simStarted() ? "Restart" : "Start"} Simulation
                            </button>
                        </div>
                    </div>
                    <div class={styles.stat2}>
                        <div style={"display: flex; margin: 8px;"}>
                            <div style="width: 80%; margin-top: 4px;  text-align: right; color: #DD4944; font-size: 18px; font-family: Segoe UI; font-weight: 300; word-wrap: break-word">
                                Weeks: <b>{stats().weeks}</b>
                            </div>
                        </div>
                        <div style={"display: flex;"}>
                            <div style="width: 80%; text-align: right; color: #DD4944; font-size: 18px; font-family: Segoe UI; font-weight: 300; word-wrap: break-word">
                                Number of dead lions: <b>{stats().numDeadLions}</b>
                            </div>
                        </div>
                        <div style={"display: flex;"}>
                            <div style="width: 80%; text-align: right; color: #DD4944; font-size: 18px; font-family: Segoe UI; font-weight: 300; word-wrap: break-word">
                                Number of dead people: <b>{stats().numberDeadPeople}</b>
                            </div>
                        </div>
                        <div style={"display: flex;"}>
                            <div style="width: 80%; text-align: right; color: #DD4944; font-size: 18px; font-family: Segoe UI; font-weight: 300; word-wrap: break-word">
                                Number of food consumed: <b>{stats().foodConsumed}</b>
                            </div>
                        </div>
                        <div style={"display: flex;"}>
                            <div style="width: 80%; text-align: right; color: #DD4944; font-size: 18px; font-family: Segoe UI; font-weight: 300; word-wrap: break-word">
                                Number of poison consumed: <b>{stats().poisonConsumed}</b>
                            </div>
                        </div>
                    </div>
                </div>
                <div class={styles.row2}>
                    <div style={"width: 260px; margin-left: 2.9vw; padding-top: 90px"}>
                        {simStarted() ? <Gears /> : <PolarClock />}
                    </div>
                </div>
            </div>
            <div class={styles.col2}>
                <People
                    numOfPeople={numOfPeople}
                    setNumOfPeople={setNumOfPeople}
                    numOfLions={numOfLions}
                    setNumOfLions={setNumOfLions}
                    start={start}
                    setStart={setStart}
                    numOfFood={numOfFood}
                    setNumOfFood={setNumOfFood}
                    speed={speed}
                    setSpeed={setSpeed}
                    canLionsStarve={canLionsStarve}
                    stats={stats}
                    setStats={setStats}
                />
            </div>
            {/* <div>
                <Tree />{" "}
            </div>
            <div>
                <Gears />
            </div>
            <div style={"margin: 20px"}>
                <RadialTree />
            </div>
            <div>
                <PlotWithOffset />
            </div>
            <div>
                <Tadpoles />
            </div>
            <div>
                <PolarClock />
            </div> */}
        </div>
    );
};

export default App;

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
