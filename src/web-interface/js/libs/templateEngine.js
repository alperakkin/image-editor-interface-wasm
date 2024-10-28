var updated_templates = []
function loadTemplates() {
    let templates = Array.from(document.querySelectorAll('[class^="template"]'));
    Array.from(templates).forEach(template => {

        if (!updated_templates.includes(template.getAttribute('path')))
            loadComponent(template);
    })
}

function loadComponent(template) {
    const path = template.getAttribute('path');
    updated_templates.push(path);

    fetch(`${path}.html`)
        .then(response => response.text())
        .then(html => {
            var activeTemplate = document.querySelector(`[path="${path}"]`);
            if (activeTemplate)
                activeTemplate.parentElement.innerHTML += html;





        }).then(async () => {

            activeTemplate = document.querySelector(`[path="${path}"]`);
            if (!activeTemplate.getAttribute('class').includes('html-only')) {
                import(`./../${path}.js`);

            }

            document.querySelector(`[path="${path}"]`).remove();

            loadTemplates();








        })
        .catch(error =>
            console.error(
                `Component [${template.getAttribute('path')}]could not be imported: ${error}`));
}



document.addEventListener("DOMContentLoaded", () => {
    loadTemplates();
})