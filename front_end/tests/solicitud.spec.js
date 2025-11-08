import { test, expect } from "@playwright/test";

test("Verifica el contenido del formulario de solicitud", async ({page}) => {
    //Inicio de sesion
    await page.goto("http://localhost:5173/");
    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.fill("juanpe@gmail.com");
    await expect(inputCorreo).toHaveValue("juanpe@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.fill("Superjuan10*");
    await expect(inputContraseña).toHaveValue("Superjuan10*");
    
    const botonInicioSesion = page.getByText("Iniciar Sesión");
    await expect(botonInicioSesion).toBeVisible();

    await page.route("**/usuarios/validarSesion", async (route) =>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "correo": "juanpe@gmail.com",
            "contrasena": "Superjuan10*"
        }) //Espera a que el backend realice el logueo mediante el endpoint
        route.continue();   
    })

    const [response, dialog] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/usuarios/validarSesion") && res.status() === 201),
        page.waitForEvent("dialog"),
        botonInicioSesion.click(),
    ]); //Espera que la respuesta del backend sea exitosa

    expect(dialog.message()).toContain("Sesion iniciada");
    await dialog.accept();
    await expect(page).toHaveURL(/client/);

    //Navegacion al formulario de solicitud
    const requestFormButton = page.getByTestId("requestFormButton");
    expect(requestFormButton).toBeVisible();
    await requestFormButton.click();
    await expect(page).toHaveURL(/request-form/);

    //Verificacion de elementos del formulario
    const amountLabel = page.locator("label[for='montoInicial']"); //Encuentra el label para el campo "montoInicial"
    expect(amountLabel).toBeVisible(); //Verifica que este label sea visible
    const timeLabel = page.locator("label[for='tiempo']");
    expect(timeLabel).toBeVisible();
    const amountInput = page.locator("input[name='montoInicial']"); //Encuentra el input para el campo "montoInicial"
    expect(amountInput).toBeVisible(); //Verifica que este input sea visible
    const timeSelect = page.locator("select[name='tiempo']");
    expect(timeSelect).toBeVisible();
});

test("Creacion de una solicitud de CDT en validacion",  async ({page}) => {
    //Inicio de sesion
    await page.goto("http://localhost:5173/");
    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.fill("juanpe@gmail.com");
    await expect(inputCorreo).toHaveValue("juanpe@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.fill("Superjuan10*");
    await expect(inputContraseña).toHaveValue("Superjuan10*");
    
    const botonInicioSesion = page.getByText("Iniciar Sesión");
    await expect(botonInicioSesion).toBeVisible();

    //Intercepta la peticion del endpoint
    await page.route("**/usuarios/validarSesion", async (route) =>{
        const req = route.request(); {/* Obtiene la informacion de la peticion interceptada */}
        expect(req.method()).toBe("POST"); {/* Espera que el metodo de la peticion sea un POST */}
        const body = req.postDataJSON(); {/* Convierte el cuerpo de la peticion POST en un objeto de JavaScript */}
        expect(body).toMatchObject({
            "correo": "juanpe@gmail.com",
            "contrasena": "Superjuan10*"
        }); {/* Espera que el cuerpo del objeto coincida con el especificado */}
        route.continue();   
    }) //Espera a que el backend realice el logueo mediante el endpoint

    const [responseValidateSesion, dialog] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/usuarios/validarSesion") && res.status() === 201),
        page.waitForEvent("dialog"),
        botonInicioSesion.click(),
    ]); //Espera que la respuesta del backend sea exitosa

    expect(dialog.message()).toContain("Sesion iniciada");
    await dialog.accept();
    await expect(page).toHaveURL(/client/);

    //Navegacion al formulario de solicitud
    const requestFormButton = page.getByTestId("requestFormButton");
    expect(requestFormButton).toBeVisible();
    await requestFormButton.click();
    await expect(page).toHaveURL(/request-form/);

    //Creacion de solicitud en validación
    const amountInput = page.locator("input[name='montoInicial']");
    expect(amountInput).toBeVisible();
    await amountInput.fill("2000000"); //Llena input con el valor ingresado (2'000.000)
    expect(amountInput).toHaveValue("2000000"); //Espera que el input cuente con el valor ingresado anteriormente
    const timeSelect = page.locator("select[name='tiempo']");
    expect(timeSelect).toBeVisible();
    const optionsTime = await timeSelect.locator("option").allTextContents(); //Crea un array con todas las opciones del select indicado
    expect(optionsTime).toEqual(["3 meses", "6 meses", "9 meses", "12 meses"]); //Espera que las opciones sean las correctas
    await timeSelect.selectOption({value: "9"}); //Selecciona la opcion "9 meses" de entre las opciones
    const inValidationButton = page.getByText("Enviar");
    expect(inValidationButton).toBeVisible();
    await page.route("**/solicitudes/crearSolicitudEnValidacion", async (route) =>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "montoInicial": 2000000,
            "tiempo": "9",
            "numUsuario": "987654321"
        })
        route.continue();   
    });
    const [responseInValidation, popupButton] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/solicitudes/crearSolicitudEnValidacion") && res.status() == 201),
        page.getByText("Ok"),
        inValidationButton.click()
    ]);
    expect(popupButton).toBeVisible();
    await popupButton.click();
    await expect(page).toHaveURL(/my-requests/);
    await page.waitForTimeout(500);
});