export const Politicians = async () => {
    const politicians = await fetch('http://localhost:8088/politicians').then(pol => pol.json());
    let politicianHTML = `<article class="politicians">`
    let politicianElements = politicians.map(
        (politician) => {
            return `
            <section class="politician">
                <header class="politician__name">
                    <h1>${politician.name.first} ${politician.name.last}</h1>
                </header>
                <div class="politician__info">
                    <div>Age: ${parseInt(politician.age)}</div>
                    <div>Represents: ${politician.district}</div>
                </div>
            </section>
            `
        }
    )
    politicianElements = politicianElements.join(" ")
    politicianHTML += politicianElements;
    politicianHTML += `</article>`;
    return politicianHTML;
}