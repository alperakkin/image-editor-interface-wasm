
document.getElementById("options").addEventListener('change',

    function (event) {
        let option = event.target.value;
        editor.displayItems(option);
        const action = editor.actions[option];
        if (!action) return;

        action(originalCnv, Canvas,
            originalCtx, contextAfter);

    }

)