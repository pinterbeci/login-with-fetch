/*
    Login url: https://reqres.in/api/login
    Body:
    {
      email: "eve.holt@reqres.in",
      password: "ok"
    }
    Users url: https://reqres.in/api/users
*/



const submitBtn = document.querySelector('#login');

submitBtn.addEventListener('submit', (event) =>{

    /*
        alapvető html működés blokkolása
        azokat az eseményeket blokkolja, melyek blokkolhatóak.
        ez azt jelenti, hogy az eseményhez tartozó művelet nem fog bekövetkezni.
        pld:
            - ha linkre kattintunk, akkor tudjuk azt blokkolni, hogy ne nyissa meg az új webalapot
            - egy form, űrlap ne küldje el a szerver felé az általa bekért adatok (mint itt ebben az esetben lent)
    */
    event.preventDefault();
    let currentEmail = event.target.elements.email.value;
    let currentPassword = event.target.elements.password.value;

    const currentBody = JSON.stringify(
    {
      email: currentEmail,
      password: currentPassword
    
    });

    /*
        a 'fetch' utasítás vár egy url-t, ahová a kérést küldjük, és konfigurációs objektumot
        a 'fetch' visszatérési értéke egy 'Promise<Response>', amit egy újabb 'then' segítségével le kell kezelni,
        hogy abból kinyerjük respose adatot, és kiírassuk, rendereljük stb.

    */
    fetch( 'https://reqres.in/api/login', {

        method: 'POST', 
        body: currentBody,
        headers :{
            'Content-type': 'application/json'
        }
    }).then( (response) =>{

        if( !response.ok ){
            /*
                ebben az esetben a promise-t rejected állítjuk át.

            */

            return Promise.reject( `Login error!`);
        }
        return response.json();
    }).then(response =>{

        /*
            a fent megkapott response egy újabb Promise, amit lekezelünk és adunk neki még egy 'then'-t.
            és megkapjuk a 'token'-t a szervertől, azaz sikeresen felküldtük az bejelentkezéshez szükséges adatokat, 
            és megkaptuk a válaszunkat a szervertől.

            console.log(response);
        */

        /*
            és mivel meg van a token, így hozzá tudunk férni a felhasználó adataihoz.
        */

        // 'GET' metódus a default, a fetch esetében.
        return fetch('https://reqres.in/api/users');
        
    })
    .then( response =>{

        if( !response.ok ){

            //ha a user nem található
            return Promise.reject( `user error!`);
        }
        return response.json();
    })
    .then( user =>{

        console.log(user);
        state = user.data;

        renderToHtml();
    })
    .catch(error =>{

        //a reject-ben megadott hibaüzenet jeleník, meg ennek a catch-nek a segítségel

        //itt egy függvényt is meghívhatunk, ami a UI-n generál egy popup-t, vagy modalt és jelzi, hogy rossz a jelszó.
            console.log(error);
    })
    
    /*.catch(error =>{

        /*
            itt ebben az ágban lévő utasítás, kód akkor hajtódik végre,
            ha bármilyen hiba bekövetkezik!!!
            Lehet a hibákat is szeparálni, külön ha esetleg nincs beírva a jelszó, felhasznév stb.
        */
       /* console.log(`ERROR! ${error}`);
    });*/
});


const renderToHtml = () =>{

    let renderedDataToHtml = ``;

    for( var currentUser of state ){

        renderedDataToHtml += `
        <li class="list-group-item">
            ${currentUser.first_name} ${currentUser.last_name}
        </li>
        `;
    }

    const renderHereTheData = document.querySelector('#user-list-container');
    renderHereTheData.innerHTML = `
                                    <ul class = "list-group">
                                        ${renderedDataToHtml}
                                    </ul>
    `;
    
}