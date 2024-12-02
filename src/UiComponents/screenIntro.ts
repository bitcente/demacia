import gsap from 'gsap';
import './screenIntro.css';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(SplitText);

export class LayerIntro {
    screenIntroElement: HTMLDivElement | undefined = undefined;
    onClose: (() => void) | undefined = undefined;

    constructor({ title, description, onClose }: { title: string; description: string, onClose?: () => void; }) {
        onClose && (this.onClose = onClose);
        // Remove screenIntro component if exists already
        const oldLayerIntro = document.body.querySelector('.screenIntro');
        if (oldLayerIntro) oldLayerIntro.remove();

        // Create screenIntro with input title and description
        this.screenIntroElement = document.createElement('div');
        console.log(this.screenIntroElement);
        
        this.screenIntroElement.classList.add('screenIntro');
        this.screenIntroElement.addEventListener('click', this.close.bind(this), false);

        // TITLE
        const titleElement = document.createElement('h1');
        titleElement.innerText = title;
        this.screenIntroElement.appendChild(titleElement);

        // HR
        const hrElement = document.createElement('img');
        hrElement.src = '/assets/decorator-hr-lg.png';
        hrElement.classList.add('hr');
        this.screenIntroElement.appendChild(hrElement);

        // DESCRIPTION
        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = description;
        this.screenIntroElement.appendChild(descriptionElement);

        document.body.appendChild(this.screenIntroElement);

        // Animation
        gsap.to(this.screenIntroElement, {
            backgroundColor: 'rgb(0, 0, 0, .75)',
            duration: 2
        });

        const tl = gsap.timeline({
            onComplete: () => {
                if (!this.screenIntroElement) return;
                // CLICK ANYWHERE SIGN
                const clickAnywhereSignElement = document.createElement('h5');
                clickAnywhereSignElement.innerText = 'CLICK ANYWHERE TO CONTINUE';
                this.screenIntroElement.appendChild(clickAnywhereSignElement);
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
        // Remove screenIntro component if exists already
        if (!this.screenIntroElement) return;

        this.screenIntroElement.addEventListener('click', this.close.bind(this), false);
        gsap.to(this.screenIntroElement, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                this.screenIntroElement && this.screenIntroElement.remove();
                this.onClose?.();
            }
        })
    }
}
