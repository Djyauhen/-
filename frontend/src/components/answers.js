import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../service/auth.js";
import {CustomHttp} from "../service/custom-http.js";
import config from "../../config/config.js";

export class Answers {

    constructor() {
        this.optionsElement = null;
        this.questionTitleElement = null;
        this.currentQuestionIndex = 1;

        this.routeParams = UrlManager.getQueryParams();

        this.init();
        this.showQuiz();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    async showQuiz() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
        document.getElementById('pre-title').innerText = result.test.name;

        document.getElementById('answerFullUserName').innerText = userInfo.fullName;
        document.getElementById('answerUserEmail').innerText = userInfo.email;

        this.optionsElement = document.getElementById('answers');




        result.test.questions.forEach(question => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answers-question-options';

            this.questionTitleElement = document.createElement('h2');
            this.questionTitleElement.className = 'answers-question-title';


            this.questionTitleElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex + ':</span> ' + question.question;
            this.currentQuestionIndex++;
            optionElement.appendChild(this.questionTitleElement);

            question.answers.forEach(answer => {
                const answerItem = document.createElement('div');
                answerItem.className = 'answer-question-option';

                const inputId = answer.id;

                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer');
                inputElement.setAttribute('value', answer.id);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;


                if (answer.correct === true) {
                    answerItem.className = 'correct';
                } if (answer.correct === false) {
                    answerItem.className = 'wrong';
                }

                answerItem.appendChild(inputElement);
                answerItem.appendChild(labelElement);
                optionElement.appendChild(answerItem);
            })

            this.optionsElement.appendChild(optionElement);
        })
    }
}