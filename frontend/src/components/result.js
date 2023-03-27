import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../service/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../service/auth.js";

export class Result {
    constructor() {

        this.routeParams = UrlManager.getQueryParams();

        const results = this.routeParams.results;
        const testId = this.routeParams.id;

        document.getElementById('results-btn').onclick = function () {
            location.href = '#/answers?id=' + testId;
        };

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {

            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}

