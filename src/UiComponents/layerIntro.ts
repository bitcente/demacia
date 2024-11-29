import gsap from 'gsap';
import './layerIntro.css';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(SplitText);

export class LayerIntro {
    constructor({ title, description }: { title: string; description: string }) {
        // Remove layerIntro component if exists already
        const oldLayerIntro = document.body.querySelector('.layerIntro');
        if (oldLayerIntro) oldLayerIntro.remove();

        // Create layerIntro with input title and description
        const layerIntroElement = document.createElement('div');
        layerIntroElement.classList.add('layerIntro');

        // TITLE
        const titleElement = document.createElement('h1');
        titleElement.innerText = title;
        layerIntroElement.appendChild(titleElement);

        // HR
        const hrElement = document.createElement('img');
        hrElement.src = '/assets/decorator-hr-lg.png';
        hrElement.classList.add('hr');
        layerIntroElement.appendChild(hrElement);

        // DESCRIPTION
        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = description;
        layerIntroElement.appendChild(descriptionElement);

        document.body.appendChild(layerIntroElement);

        // Animation
        gsap.to(layerIntroElement, {
            backgroundColor: 'rgb(0, 0, 0, .75)',
            duration: 2
        });

        const tl = gsap.timeline();

        const titleSplitText = new SplitText(titleElement, { type: "words,chars" }), titleChars = titleSplitText.chars;
        tl.from(titleChars, {
            duration: .6,
            opacity: 0,
            stagger: 0.02,
            yPercent: 100,
        }, 2);

        tl.fromTo(hrElement, {
            opacity: 0,
            clipPath: "polygon(40% 0%, 60% 0%, 60% 100%, 40% 100%)",
        }, {
            opacity: 1,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: .6,
        }, 2);

        const descriptionSplitText = new SplitText(descriptionElement, { type: "words" }), descriptionWords = descriptionSplitText.words;
        tl.from(descriptionWords, {
            duration: 1,
            opacity: 0,
            stagger: 0.025,
        }, 4);
    }

    close() {
        // Remove layerIntro component if exists already
        const oldLayerIntro = document.body.querySelector('.layerIntro');
        if (oldLayerIntro) oldLayerIntro.remove();
    }
}
