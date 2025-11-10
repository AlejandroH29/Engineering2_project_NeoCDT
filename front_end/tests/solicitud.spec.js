import { test, expect } from "@playwright/test";

const inicioSesion = async ({page}) => {
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
}

test("Verifica el contenido del formulario de solicitud", async ({page}) => {
    await inicioSesion({page});

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
    const inValidationButton = page.getByText("Enviar");
    expect(inValidationButton).toBeVisible();
    const draftButton = page.getByText("Borrador");
    expect(draftButton).toBeVisible();
    // selector más robusto: buscar por role (botón) y nombre, con await
    const cancelButton = page.getByRole('button', { name: /^Cancelar$/i });
    await expect(cancelButton).toBeVisible();
});

test("Creacion de una solicitud de CDT en validacion",  async ({page}) => {
    await inicioSesion({page});

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
});

test("Creacion de una solicitud de CDT en borrador",  async ({page}) => {
    await inicioSesion({page});

    // Navegacion al formulario de solicitud
    const requestFormButton = page.getByTestId("requestFormButton");
    expect(requestFormButton).toBeVisible();
    await requestFormButton.click();
    await expect(page).toHaveURL(/request-form/);

    // Creacion de solicitud en borrador
    const amountInput = page.locator("input[name='montoInicial']");
    expect(amountInput).toBeVisible();
    await amountInput.fill("2000000");
    expect(amountInput).toHaveValue("2000000");
    const timeSelect = page.locator("select[name='tiempo']");
    expect(timeSelect).toBeVisible();
    const optionsTime = await timeSelect.locator("option").allTextContents();
    expect(optionsTime).toEqual(["3 meses", "6 meses", "9 meses", "12 meses"]);
    await timeSelect.selectOption({value: "9"});
    const draftButton = page.getByText("Borrador");
    expect(draftButton).toBeVisible();

    await page.route("**/solicitudes/crearSolicitudEnBorradorCDT", async (route) =>{
        const req = route.request();
        expect(req.method()).toBe("POST");
        const body = req.postDataJSON();
        expect(body).toMatchObject({
            "montoInicial": 2000000,
            "tiempo": "9",
            "numUsuario": "987654321"
        });
        route.continue();   
    });

    const [responseBorrador, popupButton] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/solicitudes/crearSolicitudEnBorradorCDT") && res.status() == 201),
        page.getByText("Ok"),
        draftButton.click()
    ]);
    expect(popupButton).toBeVisible();
    await popupButton.click();
    await expect(page).toHaveURL(/my-requests/);
});

test("Intento de creación con datos incompletos al enviar la solicitud", async ({page}) => {
    await inicioSesion({page});

    // Navegacion al formulario de solicitud
    const requestFormButton = page.getByTestId("requestFormButton");
    expect(requestFormButton).toBeVisible();
    await requestFormButton.click();
    await expect(page).toHaveURL(/request-form/);

    // Dejar un campo sin llenar (no rellenamos monto inicial)
    const amountInput = page.locator("input[name='montoInicial']");
    expect(amountInput).toBeVisible();
    // Asegurarse de que está vacío
    await amountInput.fill("");
    expect(amountInput).toHaveValue("");

    const timeSelect = page.locator("select[name='tiempo']");
    expect(timeSelect).toBeVisible();
    // No seleccionamos ninguna opción explícita aquí para simular que el usuario dejó un campo en blanco

    const inValidationButton = page.getByText("Enviar");
    expect(inValidationButton).toBeVisible();

    // Interceptamos el endpoint de creación y registramos si se llamó (no arrojamos para permitir continuar la prueba)
    let createCalled = false;
    await page.route("**/solicitudes/crearSolicitudEnValidacion", async (route) => {
        createCalled = true;
        await route.continue();
    });

    // Click en Enviar
    await inValidationButton.click();

    // Esperar un breve momento para ver si se intenta la petición
    await page.waitForTimeout(500);
    expect(createCalled).toBe(false);

    // Esperar y verificar el mensaje de validación presente en la UI (usar Locator + expect)
    const validationMessage = page.locator('text=El campo debe estar lleno');
    await expect(validationMessage).toBeVisible({ timeout: 50000 });

    // Asegurarse de que aún estamos en el formulario (no hubo navegación)
    await expect(page).toHaveURL(/request-form/);
});

test("Monto mínimo para creación de solicitud de CDT para enviar", async ({ page }) => {
    await inicioSesion({ page });

    // ir al formulario
    const requestFormButton = page.getByTestId("requestFormButton");
    await expect(requestFormButton).toBeVisible();
    await requestFormButton.click();
    await expect(page).toHaveURL(/request-form/);

    // llenar monto menor al mínimo
    const amountInput = page.locator("input[name='montoInicial']");
    await expect(amountInput).toBeVisible();
    await amountInput.fill("500000");
    await expect(amountInput).toHaveValue("500000");

    // seleccionar tiempo válido (si la validación requiere tiempo seleccionado)
    const timeSelect = page.locator("select[name='tiempo']");
    await expect(timeSelect).toBeVisible();
    await timeSelect.selectOption({ value: "3" });

    // interceptar intento de creación para detectar si se llama al endpoint
    let createCalled = false;
    await page.route("**/solicitudes/crearSolicitudEnValidacion", async (route) => {
        createCalled = true;
        // devolver respuesta mock (no interesa el resultado, solo detectar llamada)
        await route.fulfill({ status: 500, body: "blocked" });
    });

    // intentar enviar
    const inValidationButton = page.getByText("Enviar");
    await expect(inValidationButton).toBeVisible();
    await inValidationButton.click();

    // esperar y comprobar mensaje de validación en UI (ajusta texto si es distinto)
    const validationMessage = page.locator("text=El monto inicial debe ser mayor a 1'000,000");
    await expect(validationMessage).toBeVisible({ timeout: 5000 });

    // asegurarse de que no se intentó crear la solicitud
    expect(createCalled).toBe(false);

    // seguir en el formulario (no navegación)
    await expect(page).toHaveURL(/request-form/);
});