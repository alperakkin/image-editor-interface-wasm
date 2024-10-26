function loadTemplates(templates) {
    Array.from(templates).forEach(template => {
        loadComponent(template);
    })
}

function loadComponent(template) {
    const path = template.getAttribute('path');
    fetch(`${path}.html`)
        .then(response => response.text())
        .then(html => {
            template.innerHTML = html;
            let subTemplates = template.getElementsByClassName('template');
            loadTemplates(subTemplates);
        }).then(async () => {

            if (!template.getAttribute('class').includes('html-only')) {
                import(`./../${path}.js`);
            }






        })
        .catch(error => console.error('Component could not be imported:',
            error, template.id));
}



document.addEventListener("DOMContentLoaded", () => {
    const templates = document.getElementsByClassName("template");
    loadTemplates(templates);

})