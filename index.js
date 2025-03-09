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

const hiddenImageId = "ring-girl"; // The image that fades in from right-to-left
const formContainerId = "form-container"; // The form container that fades in from top-to-bottom

function startScene() {
  // Delay animations for 0ms after clicking the trigger
  setTimeout(() => {
    elementsToShow.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.opacity = 0; // Ensure it's initially hidden
        element.style.visibility = "visible"; // Make it visible but transparent

        let opacity = 0;
        const fadeIn = setInterval(() => {
          opacity += 0.15; // Adjust the fade speed
          element.style.opacity = opacity;
          if (opacity >= 1) {
            clearInterval(fadeIn);
          }
        }, 50);
      }
    });
  }, 0);

  // Hide the punching animation
  setTimeout(() => {
    document.getElementById("punching").style.visibility = "hidden";
  }, 2200);

  // Hide lights after 2750ms
  setTimeout(() => {
    lightsToHide.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.transition = "opacity 1s ease-out"; // Smooth fade out
        element.style.opacity = "0"; // Start fade out

        setTimeout(() => {
          element.style.visibility = "hidden";
        }, 1000); // Matches the transition duration
      }
    });
  }, 2750);

  // Handle elements with different delays
  elementsWithDelays.forEach(({ id, delay }) => {
    setTimeout(() => {
      document.getElementById(id).style.visibility = "visible";
    }, delay);
  });

  // Shift elements to the right and fade in hidden image with right-to-left effect
  const elementsToMove = ["celebrating", "boxing-ring", "crowd"];
  const duration = 1500; // Animation duration in ms
  let startTime;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateShift(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Ensure it doesn't exceed 1
    const easedProgress = easeInOutCubic(progress);
    const translateX = easedProgress * 60; // Move by 60vw

    elementsToMove.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.style.transform = `translate(calc(-50% + ${translateX}vw), -40%)`;
      }
    });

    // Handle the right-to-left fade-in effect for the hidden image
    const hiddenImage = document.getElementById(hiddenImageId);
    if (hiddenImage) {
      if (progress === 0) {
        hiddenImage.style.visibility = "visible"; // Make it visible at the start
      }

      // Create a mask effect from right to left
      const revealAmount = easedProgress * 100; // % of reveal from right to left
      hiddenImage.style.opacity = easedProgress; // Gradually increase opacity
      hiddenImage.style.maskImage = `linear-gradient(to left, rgba(0, 0, 0, 1) ${revealAmount}%, rgba(0, 0, 0, 0) ${
        revealAmount + 30
      }%)`;
      hiddenImage.style.webkitMaskImage = `linear-gradient(to left, rgba(0, 0, 0, 1) ${revealAmount}%, rgba(0, 0, 0, 0) ${
        revealAmount + 30
      }%)`; // Safari compatibility
    }

    if (progress < 1) {
      requestAnimationFrame(animateShift);
    }
  }

  function animateFormFadeIn(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    const formContainer = document.getElementById(formContainerId);
    if (formContainer) {
      if (progress === 0) {
        formContainer.style.visibility = "visible"; // Make it visible at the start
      }

      // Move from top to bottom
      const translateY = (1 - easedProgress) * -50; // Start at -50px and move to 0px
      formContainer.style.opacity = easedProgress; // Gradually increase opacity
      formContainer.style.transform = `translateY(${translateY}px)`;
    }

    if (progress < 1) {
      requestAnimationFrame(animateFormFadeIn);
    }
  }

  setTimeout(() => {
    requestAnimationFrame(animateShift);
    requestAnimationFrame(animateFormFadeIn); // Start the new form fade-in animation
  }, 3850);
}

// Scene Trigger Handling
document.addEventListener("DOMContentLoaded", function () {
  const trigger = document.querySelector(".scene-trigger");

  trigger.addEventListener("mousedown", function () {
    trigger.style.backgroundColor = "rgb(41, 41, 41)"; // Change color on click
    trigger.style.animation = "none"; // Stop animation
  });

  trigger.addEventListener("mouseup", function () {
    trigger.classList.add("fade-out"); // Apply fade-out effect
    setTimeout(() => {
      trigger.style.display = "none"; // Hide after fade-out
      setTimeout(startScene, 1000); // Start animations 1 second after fading out
    }, 500); // Match fade-out duration
  });
});
