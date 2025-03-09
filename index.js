const elementsToShow = [
  "light1-beam",
  "light2-beam",
  "light3-beam",
  "light-focus",
  "punching",
];

const lightsToHide = [
  "light1",
  "light2",
  "light3",
  "light1-beam",
  "light2-beam",
  "light3-beam",
  "light-focus",
];

const elementsWithDelays = [
  { id: "celebrating", delay: 2200 },
  { id: "boxing-ring", delay: 2750 },
  { id: "crowd", delay: 3300 },
];

const hiddenImageId = "ring-girl";
const formContainerId = "form-container";

// New independent variables for form animation
const formFadeInDelay = 4500; // Delay before form starts fading in (adjust as needed)
const formFadeInDuration = 1000; // Duration of the form fade-in animation (adjust as needed)

function startScene() {
  setTimeout(() => {
    elementsToShow.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.opacity = 0;
        element.style.visibility = "visible";

        let opacity = 0;
        const fadeIn = setInterval(() => {
          opacity += 0.15;
          element.style.opacity = opacity;
          if (opacity >= 1) {
            clearInterval(fadeIn);
          }
        }, 50);
      }
    });
  }, 0);

  setTimeout(() => {
    document.getElementById("punching").style.visibility = "hidden";
  }, 2200);

  setTimeout(() => {
    lightsToHide.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.transition = "opacity 1s ease-out";
        element.style.opacity = "0";

        setTimeout(() => {
          element.style.visibility = "hidden";
        }, 1000);
      }
    });
  }, 2750);

  elementsWithDelays.forEach(({ id, delay }) => {
    setTimeout(() => {
      document.getElementById(id).style.visibility = "visible";
    }, delay);
  });

  const elementsToMove = ["celebrating", "boxing-ring", "crowd"];
  const duration = 1500;
  let startTimeShift, startTimeForm;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateShift(currentTime) {
    if (!startTimeShift) startTimeShift = currentTime;
    const elapsed = currentTime - startTimeShift;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const translateX = easedProgress * 60;

    elementsToMove.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.transform = `translate(calc(-50% + ${translateX}vw), -40%)`;
      }
    });

    const hiddenImage = document.getElementById(hiddenImageId);
    if (hiddenImage) {
      if (progress === 0) {
        hiddenImage.style.visibility = "visible";
      }

      const revealAmount = easedProgress * 100;
      hiddenImage.style.opacity = easedProgress;
      hiddenImage.style.maskImage = `linear-gradient(to left, rgba(0, 0, 0, 1) ${revealAmount}%, rgba(0, 0, 0, 0) ${
        revealAmount + 30
      }%)`;
      hiddenImage.style.webkitMaskImage = `linear-gradient(to left, rgba(0, 0, 0, 1) ${revealAmount}%, rgba(0, 0, 0, 0) ${
        revealAmount + 30
      }%)`;
    }

    if (progress < 1) {
      requestAnimationFrame(animateShift);
    }
  }

  function animateFormFadeIn(currentTime) {
    if (!startTimeForm) startTimeForm = currentTime;
    const elapsed = currentTime - startTimeForm;
    const progress = Math.min(elapsed / formFadeInDuration, 1);
    const easedProgress = easeInOutCubic(progress);

    const formContainer = document.getElementById(formContainerId);
    if (formContainer) {
      if (progress === 0) {
        formContainer.style.visibility = "visible";
      }

      const translateY = (1 - easedProgress) * -50;
      formContainer.style.opacity = easedProgress;
      formContainer.style.transform = `translateY(${translateY}px)`;
    }

    if (progress < 1) {
      requestAnimationFrame(animateFormFadeIn);
    }
  }

  setTimeout(() => {
    requestAnimationFrame(animateShift);
  }, 3850); // Start shift animation

  setTimeout(() => {
    requestAnimationFrame(animateFormFadeIn);
  }, formFadeInDelay); // Start form fade-in animation independently
}

// Scene Trigger Handling
document.addEventListener("DOMContentLoaded", function () {
  const trigger = document.querySelector(".scene-trigger");

  trigger.addEventListener("mousedown", function () {
    trigger.style.backgroundColor = "rgb(41, 41, 41)";
    trigger.style.animation = "none";
  });

  trigger.addEventListener("mouseup", function () {
    trigger.classList.add("fade-out");
    setTimeout(() => {
      trigger.style.display = "none";
      setTimeout(startScene, 1000);
    }, 500);
  });
});
