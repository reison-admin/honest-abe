export const Corporations = async () => {
    const corporations = await fetch('http://localhost:8088/corporations').then(pol => pol.json());
    let corporationHTML = `<article class="corporations">`
    let corporationElements = corporations.map(
        (corporation) => {
            return `
            <section class="corporation">
            <header class="corporation__name">
                <h1>${corporation.name}</h1>
            </header>
            <div class="corporation__info">
                <div>Address: ${corporation.address}</div>
            </div>
        </section>
            `
        }
    )
    corporationElements = corporationElements.join(" ")
    corporationHTML += corporationElements;
    corporationHTML += `</article>`;
    return corporationHTML;
}