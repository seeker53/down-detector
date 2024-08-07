const process = require("process");
const puppeteer = require("puppeteer");
const EventEmitter = require("events");

class DownDetector extends EventEmitter {
    async detect(site) {
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.EXEC_PATH || null,
            defaultViewport: null,
            args: [
                "--window-size=600,600",
                "--disable-infobars",
                // "--no-sandbox",
                // "--disable-setuid-sandbox"
            ]
        });

        const page = (await browser.pages())[0];

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", {
                get: () => undefined
            });
        });

        try {
            await page.goto("https://downdetector.com/status/" + site);

            await page.waitForSelector(".img-fluid");
            const logo = await page.evaluate(() => {
                const image = document.querySelector(".img-fluid");
                return image ? image.src : null;
            });

            await page.waitForSelector("#company-status a");
            const url = await page.evaluate(() => {
                const anchor = document.querySelector("#company-status a");
                return anchor ? anchor.href : null;
            });

            await page.waitForSelector(".indicatorChart_percentage");
            const problems = await page.evaluate(() => {
                const problem = [...document.querySelectorAll(".indicatorChart_percentage")];
                return {
                    "app": problem[0].textContent.replace("%", "").trim(),
                    "website": problem[1].textContent.replace("%", "").trim(),
                    "server": problem[2].textContent.replace("%", "").trim()
                };
            });

            await page.waitForSelector("#comments-card div");
            const comments = await page.evaluate(() => {
                const myObj = {};
                [...document.querySelectorAll("#comments-card div[style='margin-left:65px']")].forEach((elem, index) => {
                    let newObj = {};
                    newObj[index] = {
                        "user": elem.querySelector("strong").innerText,
                        "date": elem.querySelector(".updated").innerText,
                        "comment": elem.querySelector("p").innerText.replace(elem.querySelector("strong").innerText, "")
                    };
                    Object.assign(myObj, newObj);
                });
                return myObj;
            });

            await page.waitForSelector("script");
            const chart = await page.evaluate(() => {
                let data = { "data": null, "baseline": null };
                document.querySelectorAll("script").forEach((elem) => {
                    if (elem.innerHTML.includes("window.DD.chartTranslations") && elem.innerHTML.includes("window.DD.currentServiceProperties")) {
                        const array = elem.innerText.replace(/ /g, "").replace(/\n/g, "").split("data:");
                        array.shift();
                        let data1 = array[0].slice(0, array[0].indexOf("],}") + 1).replace(/x/g, '"x"').replace(/y/g, '"y"').replace(/'/g, '"').replace(",]", "]");
                        let data2 = array[1].slice(0, array[1].indexOf("},}}")).replace(/x/g, '"x"').replace(/y/g, '"y"').replace(/'/g, '"').replace(",]", "]");
                        data["data"] = JSON.parse(data1);
                        data["baseline"] = JSON.parse(data2);
                    }
                });
                return data;
            });

            const myFinalObj = {
                logo: logo,
                url: url,
                problems: problems,
                comments: comments,
                chart: chart
            };

            browser.close();

            this.emit("response", [200, myFinalObj]);

        } catch (error) {
            console.error("Error detecting site status:", error);
            this.emit("response", [500, { error: "Error detecting site status" }]);
            await browser.close();
        }
    }
}

module.exports = DownDetector;
