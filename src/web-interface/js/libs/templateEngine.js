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

            activeTemplate = document.querySelector(`[path="${path}"]`);
            activeTemplate.parentElement.innerHTML += html;


            let subTemplates = activeTemplate.getElementsByClassName('template');
            loadTemplates(subTemplates);
            activeTemplate.remove();


        }).then(async () => {

            if (!template.getAttribute('class').includes('html-only')) {
                import(`./../${path}.js`);

            }

            activeTemplate = document.querySelector(`[path="${path}"]`).remove();








        })
        .catch(error => console.error('Component could not be imported:',
            error, template.id));
}



document.addEventListener("DOMContentLoaded", () => {
    let templates = Array.from(document.getElementsByClassName("template"));
    loadTemplates(templates);


})