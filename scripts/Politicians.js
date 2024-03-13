export const Politicians = async () => {
    // const politicians = await fetch('http://localhost:8088/politicians?_embed=politicianlegislations').then(pol => pol.json());
    // const legislations = await fetch('http://localhost:8088/legislations').then(law => law.json());
    // const corporateinterests = await fetch('http://localhost:8088/corporateinterests?_expand=corporation').then(int => int.json());
    
    const fetchData = async () => {
        try {
            const response = await Promise.all([
                fetch('http://localhost:8088/politicians?_embed=politicianlegislations'),
                fetch('http://localhost:8088/legislations'),
                fetch('http://localhost:8088/corporateinterests?_expand=corporation'),
                fetch('http://localhost:8088/pacdonations?_expand=pac'),
                fetch('http://localhost:8088/corporatedonations')        
            ]);
            const data = await Promise.all(response.map(r => r.json()))
            return data;

        }
        catch {
            throw Error('Promises broken');
        }
    }
    //get data tables
    const politicianBillsData = await fetchData();

    let politicianHTML = `<article class="politicians">`
    //for each politician...
    let politicianElements = politicianBillsData[0].map(
        (politician) => {
            let sponsoredBillsHTML = '';
            let corpInterestsHTML = '';
            //find PACs associated by donations to this politician
            let associatedPacs = politicianBillsData[3].filter(({politicianId}) => politicianId === politician.id);

            //iterate through sponsored legislation to find the interest served
            for (const law of politician.politicianlegislations) {

                let lawInterestId = politicianBillsData[1].find(({id}) => id === law.legislationId).interestId;
                //add sponsored bill to sponsoredBillsHTML
                sponsoredBillsHTML += `<li> ${politicianBillsData[1].find(({id}) => id === law.legislationId).name} </li>`
                //find corporations interested in this law
                let corporationsInterestedInLaw = politicianBillsData[2].filter(({interestId}) => interestId === lawInterestId)
                //for each corp interested in this law
                for (const corporation of corporationsInterestedInLaw) {
                    //find PACs contributed to by the corp
                    let associatedDonatingPACs = politicianBillsData[4].filter(({corporationId}) => corporationId === corporation.corporationId)
                    //initiate empty array to populate with PAC Ids 
                    let associatedDonatingPACIds = [];
                    for (const pac of associatedDonatingPACs) {
                        //populate array with Ids of PACs donated to by the interested corporation
                        associatedDonatingPACIds.push(pac.pacId);
                    }
                    //create a set from PAC ids donated to by the interested corporation
                    const associatedPacIds = new Set(associatedDonatingPACIds);
                    for (const pac of associatedPacs) {
                        //if the interested corporation has donated to a PAC associated with this politician, add the corp to HTML
                        if(associatedPacIds.has(pac.pacId)) {
                            corpInterestsHTML += `<li>${corporation.corporation.company}</li>`
                        }
                    }
                }
            }
            let contributingPacsHTML = '';
            //build string of PACs associated with the politician
            for (let i = 0; i < associatedPacs.length; i++) {
                contributingPacsHTML += `<li>${associatedPacs[i].pac.registeredName}</li>`
            }

            return `
            <section class="politician">
                <header class="politician__name">
                    <h1>${politician.name.first} ${politician.name.last}</h1>
                </header>
                <div class="politician__info">
                    <div>Age: ${parseInt(politician.age)}</div>
                    <div>Represents: ${politician.district}</div>
                    <div class="politician__bills">
                        <h2>Sponsored Bills</h2>
                        <div>
                        ${sponsoredBillsHTML}
                        </div>
                    </div>
                    <div class="politician__funders">
                        <h2>Related PACs</h2>
                        <ul>
                        ${contributingPacsHTML}
                        </ul>
                    </div>
                    <div class="politician__influencers">
                        <h3>Influencing Corporations</h3>
                        <ul>
                        ${corpInterestsHTML}
                        </ul>
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