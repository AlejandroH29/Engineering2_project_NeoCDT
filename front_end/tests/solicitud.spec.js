import { test, expect } from "@playwright/test";

test("Verifica el contenido del formulario de solicitud", async ({page}) => {

    //Inicio de sesion
    await page.goto("http://localhost:5173/");
    const inputCorreo = page.locator('input[name="correo"]');
    await expect(inputCorreo).toBeVisible();
    await inputCorreo.fill("sepulvedacsamuel09@gmail.com");
    await expect(inputCorreo).toHaveValue("sepulvedacsamuel09@gmail.com");

    const inputContraseña = page.locator('input[name="contrasena"]');
    await expect(inputContraseña).toBeVisible();
    await inputContraseña.fill("Samupipe23*");
    await expect(inputContraseña).toHaveValue("Samupipe23*");
    
    const botonInicioSesion = page.getByText("Iniciar Sesión");
    await expect(botonInicioSesion).toBeVisible();

    await page.route("**/usuarios/validarSesion", async (route) =>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "correo": "sepulvedacsamuel09@gmail.com",
            "contrasena": "Samupipe23*"
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

// test("Creacion de una solicitud de CDT enValidacion",  async ({page}) => {
//     await page.goto("http://localhost:5173/request-form");

// })