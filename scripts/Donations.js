export const Donations = async () => {
    //fetch politicians table with donations
    const polDonations = await fetch('http://localhost:8088/politicians?_embed=pacdonations').then(donations => donations.json());
    //fetch pacs for lookup
    const pacs = await fetch('http://localhost:8088/pacs').then(pacs => pacs.json());
    let polDonationsHTML = `<article class="politicians">`
    //lookup function by PAC id
    const lookupPac = (pacId) => {
        //if id matches pacId, returns name of PAC
        return pacs.find(({id}) => id === pacId).registeredName;
    }
    let politicianElements = polDonations.map(
        (politician) => {
            let donationsHTML = "";
            //iterate donations for politician
            for (let i = 0; i < politician.pacdonations.length; i++) {
                //lookup PAC name by pacId 
                let pacName = lookupPac(politician.pacdonations[i].pacId)
                //format donation in USD
                let amount = politician.pacdonations[i].amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
                //build list elements with PAC names and associated donation amounts
                donationsHTML += `<li>${pacName} (${amount})</li>`
            }

            return `

            <section class="politician">
                <header class="politician__name">
                    <h1>${politician.name.first} ${politician.name.last}</h1>
                </header>
                <div class="politician__info">
                    <div>Age: ${politician.age}</div>
                    <div>Represents: ${politician.district}</div>
                </div>
                <div class="pac__donations">
                    <h2>PAC Donations</h2>
                    <ul>
                        ${donationsHTML}
                    </ul>
                </div>
            </section>
            `
        }
    )
    politicianElements = politicianElements.join(" ");
    polDonationsHTML += politicianElements;
    polDonationsHTML += `</article>`;
    return polDonationsHTML;
}