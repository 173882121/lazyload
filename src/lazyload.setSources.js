export const setSourcesForPicture = function (element, settings) {
    const {data_srcset: dataSrcSet} = settings;
    const parent = element.parentElement;
    if (parent.tagName !== "PICTURE") {
        return;
    }
    for (let i = 0, pictureChild; pictureChild = parent.children[i]; i += 1) {
        if (pictureChild.tagName === "SOURCE") {
            let sourceSrcset = pictureChild.dataset[dataSrcSet];
            if (sourceSrcset) {
                pictureChild.setAttribute("srcset", sourceSrcset);
            }
        }
    }
};

export const setSources = function (deps, element, settings) {
    const {data_src: dataSrc, data_srcset: dataSrcSet} = settings;
    const {setSourcesForPicture} = deps;
    const tagName = element.tagName;
    const elementSrc = element.dataset[dataSrc];
    
    if (tagName === "IMG") {
        setSourcesForPicture(element, settings);
        const imgSrcset = element.dataset[dataSrcSet];
        if (imgSrcset) {
            element.setAttribute("srcset", imgSrcset);
        }
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (tagName === "IFRAME") {
        if (elementSrc) {
            element.setAttribute("src", elementSrc);
        }
        return;
    }
    if (elementSrc) {
        element.style.backgroundImage = `url("${elementSrc}")`;
    }
};