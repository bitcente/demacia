import gsap from 'gsap';
import './layerIntro.css';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(SplitText);

export class LayerIntro {
    layerIntroElement: HTMLDivElement | undefined = undefined;

    constructor({ title, description }: { title: string; description: string }) {
        // Remove layerIntro component if exists already
        const oldLayerIntro = document.body.querySelector('.layerIntro');
        if (oldLayerIntro) oldLayerIntro.remove();

        // Create layerIntro with input title and description
        this.layerIntroElement = document.createElement('div');
        console.log(this.layerIntroElement);
        
        this.layerIntroElement.classList.add('layerIntro');
        this.layerIntroElement.addEventListener('click', this.close.bind(this), false);

        // TITLE
        const titleElement = document.createElement('h1');
        titleElement.innerText = title;
        this.layerIntroElement.appendChild(titleElement);

        // HR
        const hrElement = document.createElement('img');
        hrElement.src = '/assets/decorator-hr-lg.png';
        hrElement.classList.add('hr');
        this.layerIntroElement.appendChild(hrElement);

        // DESCRIPTION
        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = description;
        this.layerIntroElement.appendChild(descriptionElement);

        document.body.appendChild(this.layerIntroElement);

        // Animation
        gsap.to(this.layerIntroElement, {
            backgroundColor: 'rgb(0, 0, 0, .75)',
            duration: 2
        });

        const tl = gsap.timeline({
            onComplete: () => {
                if (!this.layerIntroElement) return;
                // CLICK ANYWHERE SIGN
                const clickAnywhereSignElement = document.createElement('h5');
                clickAnywhereSignElement.innerText = 'CLICK ANYWHERE TO CONTINUE';
                this.layerIntroElement.appendChild(clickAnywhereSignElement);
                gsap.to(clickAnywhereSignElement, {
                    autoAlpha: 1,
                    delay:  1,
                    duration: 1
                })
            }
        });

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
        console.log("JEJE", this.layerIntroElement);
        
        // Remove layerIntro component if exists already
        if (!this.layerIntroElement) return;

        this.layerIntroElement.addEventListener('click', this.close.bind(this), false);
        gsap.to(this.layerIntroElement, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.layerIntroElement && this.layerIntroElement.remove();
            }
        })
    }
}
