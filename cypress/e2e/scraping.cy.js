describe('Web Scraping Test', () => {
    it('Scraping data from Beisbolcubano', () => {
        cy.visit('https://www.beisbolcubano.cu/').then(() => {
            cy.log('Page loaded').then(() => {
                cy.title().should('eq', 'LEB | Sitio Oficial de la Liga Elite del Béisbol Cubano');
                
                // Obtener la baseUrl desde la configuración de Cypress
                const baseUrl = Cypress.config('baseUrl');

                // Crear un objeto para almacenar los datos
                let juegosData = [];

                // Obtener la fecha
                cy.get('#MainContent_MiniDayScore_UC_fecha_link')
                    .invoke('text')
                    .then((fechaTexto) => {
                        const fechaLimpia = fechaTexto.trim(); // Eliminar espacios y saltos de línea
                        cy.log(`Fecha obtenida: ${fechaLimpia}`);

                        // Convertir la fecha al formato aaaa-mm-dd
                        const [dia, mes, anio] = fechaLimpia.split('/');
                        const fechaFormateada = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                        const carpeta = `${anio}-${mes.padStart(2, '0')}`;
                        const rutaArchivo = `cypress/fixtures/${carpeta}/${fechaFormateada}.json`;

                        // Iterar sobre cada <li> dentro del <ul>
                        cy.get('#MainContent_MiniDayScore_UC_sidebarDayScore_Left ul li').each(($li, index) => {
                            cy.wrap($li).within(() => {
                                let juego = { equipo1: {}, equipo2: {}, estadoDelJuego: '' };

                                // Obtener el texto del span dentro del primer div del li
                                cy.get("div span")
                                    .first()
                                    .invoke('text')
                                    .then((estadoDelJuego) => {
                                        juego.estadoDelJuego = estadoDelJuego;
                                        cy.log(`Juego ${index + 1} - Estado del Juego: ${estadoDelJuego}`);
                                    });

                                // Datos del primer equipo (primer div dentro de la <a>)
                                cy.get("a[title='BoxScore'] div")
                                    .eq(0) // Primer div
                                    .within(() => {
                                        cy.get('img')
                                            .invoke('attr', 'src')
                                            .then((equipo1Logo) => {
                                                juego.equipo1.logo = `${baseUrl}`+equipo1Logo; // Concatenar la baseUrl con el logo
                                                cy.log(`Logo del equipo 1: ${juego.equipo1.logo}`);
                                            });

                                        cy.get('img')
                                            .invoke('attr', 'alt')
                                            .then((equipo1Nombre) => { 
                                                juego.equipo1.nombre = equipo1Nombre;
                                            });

                                        cy.get('span')
                                            .first()
                                            .invoke('text')
                                            .then((equipo1Abreviatura) => {
                                                juego.equipo1.abreviatura = equipo1Abreviatura;
                                            });

                                        cy.get('span')
                                            .eq(1)
                                            .invoke('text')
                                            .then((equipo1NombreCompleto) => {
                                                juego.equipo1.nombreCompleto = equipo1NombreCompleto;
                                            });
                                    });

                                // Datos del segundo equipo (segundo div dentro de la <a>)
                                cy.get("a[title='BoxScore'] div")
                                    .eq(1) // Segundo div
                                    .within(() => {
                                        cy.get('img')
                                            .invoke('attr', 'src')
                                            .then((equipo2Logo) => {
                                                juego.equipo2.logo = `${baseUrl}`+equipo2Logo; // Concatenar la baseUrl con el logo
                                                cy.log(`Logo del equipo 1: ${juego.equipo2.logo}`);
                                            });

                                        cy.get('img')
                                            .invoke('attr', 'alt')
                                            .then((equipo2Nombre) => {
                                                juego.equipo2.nombre = equipo2Nombre;
                                            });

                                        cy.get('span')
                                            .first()
                                            .invoke('text')
                                            .then((equipo2Abreviatura) => {
                                                juego.equipo2.abreviatura = equipo2Abreviatura;
                                            });

                                        cy.get('span')
                                            .eq(1)
                                            .invoke('text')
                                            .then((equipo2NombreCompleto) => {
                                                juego.equipo2.nombreCompleto = equipo2NombreCompleto;
                                            });
                                    });

                                    // Obtener los runs del juego solo si el estado es 'Final'
                                cy.get("div span")
                                .first()
                                .invoke('text')
                                .then((estadoDelJuego) => {
                                    if (estadoDelJuego === 'Final' || estadoDelJuego === 'Comenzando...') {
                                        cy.get("div[class='Mini_DayScore_Runs']")
                                            .eq(0) // Runs del primer equipo
                                            .find('span')
                                            .invoke('text')
                                            .then((runs1) => {
                                                juego.equipo1.runs = runs1;
                                                cy.log(`Juego ${index + 1} - Equipo 1 Runs: ${runs1}`);
                                            });

                                        cy.get("div[class='Mini_DayScore_Runs']")
                                            .eq(1) // Runs del segundo equipo
                                            .find('span')
                                            .invoke('text')
                                            .then((runs2) => {
                                                juego.equipo2.runs = runs2;
                                                cy.log(`Juego ${index + 1} - Equipo 2 Runs: ${runs2}`);
                                            });
                                    } else {
                                        juego.equipo1.runs = 0;
                                        juego.equipo2.runs = 0
                                    }
                                });

                                // Agregar el juego al array de datos
                                cy.then(() => {
                                    juegosData.push(juego);
                                });
                            });
                        }).then(() => {
                            // Crear el objeto final con la información de la fecha y los juegos
                            const datosFinales = {
                                Fecha: fechaLimpia, // Usar la fecha limpia
                                CantidadDeJuegos: juegosData.length,
                                Juegos: juegosData
                            };

                            // Guardar los datos en un archivo JSON en la carpeta correspondiente
                            cy.writeFile(rutaArchivo, datosFinales);
                        });
                    });
            });
        });
    });
});