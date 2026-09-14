import { databases, appwriteConfig } from "./databases.js";

(() => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const note = form.querySelector(".form-note");
  const button = form.querySelector('button[type="submit"]');
  const serviceSelect = form.elements.namedItem("service");
  const otherField = form.querySelector(".cf-other");
  const otherInput = otherField ? otherField.querySelector("input") : null;

  function setNote(message, state) {
    if (!note) return;
    note.textContent = message;
    note.setAttribute("role", state === "error" ? "alert" : "status");
    note.dataset.state = state;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const service =
      serviceSelect && serviceSelect.value === "Something else"
        ? (otherInput ? otherInput.value.trim() : "") || "Something else"
        : serviceSelect
          ? serviceSelect.value
          : "";

    const data = {
      name: form.elements.namedItem("name").value.trim(),
      email: form.elements.namedItem("email").value.trim(),
      service,
      budget: form.elements.namedItem("budget").value,
      message: form.elements.namedItem("message").value.trim(),
      source: appwriteConfig.source,
    };

    if (button) {
      button.disabled = true;
      button.textContent = "Sending…";
    }
    setNote("", "idle");

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        "unique()",
        data,
      );
      setNote("Message sent — I'll reply within 24 hours. Thanks!", "success");
      form.reset();
      if (serviceSelect) serviceSelect.value = "";
      if (otherField) otherField.classList.add("hidden");
    } catch (error) {
      console.error("Contact form error:", error);
      setNote(
        "Something went wrong. Please try again or email me directly.",
        "error",
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Send inquiry";
      }
    }
  });

  if (serviceSelect && otherField && otherInput) {
    serviceSelect.addEventListener("change", () => {
      const isOther = serviceSelect.value === "Something else";
      otherField.classList.toggle("hidden", !isOther);
      otherInput.required = isOther;
    });
  }
})();