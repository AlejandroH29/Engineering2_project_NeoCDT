import { test, expect, selectors } from '@playwright/test'

test.describe.configure({ mode: 'serial' });

test("Verificacion de contenido pagina inicial", async ({ page })=>{
    await page.goto("http://localhost:5173/");
    const locatorLabel = page.locator('label[for="correo"]');
    expect(locatorLabel).toBeVisible();
    const inputCorreo = page.locator('input[name="correo"]');
    expect(inputCorreo).toBeVisible();
    const linkRegistro = page.getByText("Register");
    await expect(linkRegistro).toBeVisible();
    const botonIniciarS = page.getByText("Iniciar Sesión");
    await expect(botonIniciarS).toBeVisible();
});

test("Registro de cuenta", async ({ page })=>{

    await page.goto("http://localhost:5173/");
    const linkRegistro = page.getByText("Register");
    await linkRegistro.click();
    await page.waitForURL(/register/);

    const selectorTipoId = page.locator('select[name="tipoIdentificacion"]');
    await expect(selectorTipoId).toBeVisible();
    const opciones = await selectorTipoId.locator('option').allTextContents();
    expect(opciones).toEqual(['CC', 'CE', 'Pasaporte']);
    await selectorTipoId.selectOption({ value: "CC"});
    await expect(selectorTipoId).toHaveValue("CC");

    const inputId = page.locator('input[name = "numeroIdentificacion"]');
    await expect(inputId).toBeVisible();
    await inputId.fill("1000000000");
    await expect(inputId).toHaveValue("1000000000");

    const inputNombre = page.locator('input[name="nombreCompleto"]');
    await expect(inputNombre).toBeVisible();
    await inputNombre.type("Diego Hernandez");
    await expect(inputNombre).toHaveValue("Diego Hernandez");

    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.type("ejemplo@gmail.com");
    await expect(inputCorreo).toHaveValue("ejemplo@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.type("Diego1234.");
    await expect(inputContraseña).toHaveValue("Diego1234.");

    const botonRegistrar = page.getByText("Registrarse");
    await page.route("**/usuarios/crearUsuario", async (route) => {
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "numeroIdentificacion": "1000000000",
            "nombreCompleto": "Diego Hernandez",
            "tipoIdentificacion": "CC",
            "correo": "ejemplo@gmail.com",
            "contrasena": "Diego1234.",
            "tipo": "Cliente"
        });
        route.continue();
    });
    //const alertaRegistro = page.waitForEvent("dialog");
    const [response, dialog] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/usuarios/crearUsuario") && res.status() === 201),
        page.waitForEvent("dialog"),
        botonRegistrar.click(),
    ]);
    //const popupCreacionU = page.locator(".popup-overlay");
    //await expect(popupCreacionU).toBeVisible({ timeout: 10000 });
    //const textoPopup = page.locator(".popup-overlay p");
    //await expect(textoPopup).toHaveText("Usuario creado con exito");

    //const botonPopup = page.getByRole("button", {name: "Aceptar"});
    //await botonPopup.click();
    //await expect(popupCreacionU).toBeHidden();
    //const dialog = await alertaRegistro;
    expect(dialog.message()).toContain("Usuario creado con exito");
    await dialog.accept();
    await expect(page).toHaveURL("http://localhost:5173/");
});

test("Inicio de sesion", async ({page}) =>{

    await page.goto("http://localhost:5173/");
    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.fill("ejemplo@gmail.com");
    await expect(inputCorreo).toHaveValue("ejemplo@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.fill("Diego1234.");
    await expect(inputContraseña).toHaveValue("Diego1234.");

    const botonInicioSesion = page.getByText("Iniciar Sesión");
    await expect(botonInicioSesion).toBeVisible();
    
    await page.route("**/usuarios/validarSesion", async (route) =>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "correo": "ejemplo@gmail.com",
            "contrasena": "Diego1234."
        })
        route.continue();   
    })
    //const alertaInicioSesion = page.waitForEvent("dialog");
    const [response, dialog] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/usuarios/validarSesion") && res.status() === 201),
        page.waitForEvent("dialog"),
        botonInicioSesion.click(),
    ]);
    //const popupInicioS = page.locator(".popup-overlay");
    //await expect(popupInicioS).toBeVisible({ timeout: 10000 });
    //const textoPopup = page.locator(".popup-overlay p");
    //await expect(textoPopup).toHaveText("Sesion iniciada");

    //const botonPopup = page.getByRole("button", {name: "Aceptar"});
    //await botonPopup.click();
    //await expect(popupInicioS).toBeHidden();
    //const dialog = await alertaInicioSesion;
    expect(dialog.message()).toContain("Sesion iniciada");
    await dialog.accept();
    await expect(page).toHaveURL(/client/);
});

test("Registro de cuenta con correo ya existente", async ({page})=>{
    await page.goto("http://localhost:5173/");
    const linkRegistro = page.getByText("Register");
    await linkRegistro.click();
    await page.waitForURL(/register/);

    const selectorTipoId = page.locator('select[name="tipoIdentificacion"]');
    await expect(selectorTipoId).toBeVisible();
    const opciones = await selectorTipoId.locator('option').allTextContents();
    expect(opciones).toEqual(['CC', 'CE', 'Pasaporte']);
    await selectorTipoId.selectOption({ value: "CC"});
    await expect(selectorTipoId).toHaveValue("CC");

    const inputId = page.locator('input[name = "numeroIdentificacion"]');
    await expect(inputId).toBeVisible();
    await inputId.fill("1000000000");
    await expect(inputId).toHaveValue("1000000000");

    const inputNombre = page.locator('input[name="nombreCompleto"]');
    await expect(inputNombre).toBeVisible();
    await inputNombre.type("Diego Hernandez");
    await expect(inputNombre).toHaveValue("Diego Hernandez");

    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.type("ejemplo@gmail.com");
    await expect(inputCorreo).toHaveValue("ejemplo@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.type("Diego1234.");
    await expect(inputContraseña).toHaveValue("Diego1234.");

    const botonRegistrar = page.getByText("Registrarse");
    await expect(botonRegistrar).toBeVisible();
    await page.route("**/usuarios/crearUsuario", async (route)=>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "numeroIdentificacion": "1000000000",
            "nombreCompleto": "Diego Hernandez",
            "tipoIdentificacion": "CC",
            "correo": "ejemplo@gmail.com",
            "contrasena": "Diego1234.",
            "tipo": "Cliente"
        })
        route.continue();
    })

    const [response] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/usuarios/crearUsuario") && res.status() === 500),
        botonRegistrar.click()
    ])

    const popupCorreoRepetido = page.locator(".popup-overlay");
    await expect(popupCorreoRepetido).toBeVisible({ timeout: 10000 });
    const textoPopup = page.locator(".popup-overlay p");
    await expect(textoPopup).toHaveText("El correo de usuario ya esta en uso");

    const botonPopup = page.getByText("Ok");
    await botonPopup.click();
    await expect(popupCorreoRepetido).toBeHidden();
    await expect(page).toHaveURL(/register/);
});

test("Inicio de sesion con contraseña incorrecta", async ({page}) =>{

    await page.goto("http://localhost:5173/");
    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.fill("ejemplo@gmail.com");
    await expect(inputCorreo).toHaveValue("ejemplo@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.fill("Diego12345.");
    await expect(inputContraseña).toHaveValue("Diego12345.");

    const botonInicioSesion = page.getByText("Iniciar Sesión");
    await expect(botonInicioSesion).toBeVisible();
    
    await page.route("**/usuarios/validarSesion", async (route) =>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "correo": "ejemplo@gmail.com",
            "contrasena": "Diego12345."
        })
        route.continue();   
    })
    //const alertaInicioSesion = page.waitForEvent("dialog");
    const [response] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/usuarios/validarSesion") && res.status() === 500),
        botonInicioSesion.click(),
    ]);
    const popupInicioSIncorrecto = page.locator(".popup-overlay");
    await expect(popupInicioSIncorrecto).toBeVisible({ timeout: 10000 });
    const textoPopup = page.locator(".popup-overlay p");
    await expect(textoPopup).toHaveText("Contraseña incorrecta");

    const botonPopup = page.getByText("Ok");
    await botonPopup.click();
    await expect(popupInicioSIncorrecto).toBeHidden();

    //const dialog = await alertaInicioSesion;
    await expect(page).toHaveURL("http://localhost:5173/");
});

