Array.from(document.getElementsByClassName("histogramColor")).forEach(
    function (elem) {
        elem.addEventListener('click',
            function (event) {
                editor.selectHistogramColors();

            }

        )
    }
)