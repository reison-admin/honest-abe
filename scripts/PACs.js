//suitable for PACs -> Pols

export const PACs = async () => {
    const pacCorporateDonations = await fetch('http://localhost:8088/pacs?_embed=corporatedonations').then(pac => pac.json());
    const corporations = await fetch('http://localhost:8088/corporations').then(corp => corp.json());
    const lookupCorporation = (corporationId) => {
        return corporations.find(({id}) => id === corporationId).company;
    }
    let pacDonationsHTML = `<article class="pacs">`
    let pacDonationElements = pacCorporateDonations.map(
        (pac) => {
            let pacDonationsHTML = "";

            for (let i=0; i<pac.corporatedonations.length; i++) {
                let corporationName = lookupCorporation(pac.corporatedonations[i].corporationId);
                let amount = pac.corporatedonations[i].amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
                pacDonationsHTML += `<li>${corporationName} (${amount})</li>`
            }
            return `
            <section class="pac">
                <header class="pac__name">
                    <h1>${pac.registeredName}</h1>
                </header>
                <div class="pac__info">
                    <div>${pac.address}</div>
                </div>
                <div class="pac__donors">
                    <h2>Donors</h2>
                    <ul>
                        ${pacDonationsHTML}
                    </ul>
                </div>
            </section>
            `
        }
    )
    pacDonationElements = pacDonationElements.join(" ")
    pacDonationsHTML += pacDonationElements;
    pacDonationsHTML += `</article>`;
    return pacDonationsHTML;
}