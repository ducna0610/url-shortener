const copyContent = async (btn) => {
    try {
        let text = btn.dataset.short;
        await navigator.clipboard.writeText(window.location.host + '/' + text);

        Toastify({
            text: "Copied!",
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            duration: 1500
            }).showToast();
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};

const alertCreated = async () => {
    try {
        Toastify({
            text: "Created!",
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            duration: 1500,
            style: {
              background: "linear-gradient(to right, #00B09B, #96C93D )",
            },
            }).showToast();
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};


const alertUpdated = async () => {
    try {
        Toastify({
            text: "Updated!",
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            duration: 1500,
            style: {
              background: "linear-gradient(to right, #F09819, #EDDE5D )",
            },
            }).showToast();
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};

const alertDeleted = async () => {
    try {
        Toastify({
            text: "Deleted!",
            gravity: "bottom", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            duration: 1500,
            style: {
              background: "linear-gradient(to right, #EB3349, #F45C43)",
            },
            }).showToast();
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
};
