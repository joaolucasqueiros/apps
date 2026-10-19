import {test,expect} from '@playwright/test';
import {lessons} from '../src/content/lessons';
test('lesson practice, explanation and exact position persist after reload',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:/Olá/})).toBeVisible();
 await page.getByRole('link',{name:'Continuar estudando',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Simple Past',exact:true,level:1})).toBeVisible();
 await page.getByRole('button',{name:'Praticar o que aprendi'}).click();
 
 await page.getByRole('button',{name:/^[A-D] worked$/}).click();
 await page.getByRole('button',{name:'Verificar resposta'}).click();await expect(page.getByText('Muito bem! Você acertou.')).toBeVisible();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();await expect(page.getByText('Exercício 2 de 7')).toBeVisible();
 await page.reload();await expect(page.getByText('Exercício 2 de 7')).toBeVisible();
 await page.getByRole('textbox',{name:'Sua resposta'}).fill('visit');await page.getByRole('button',{name:'Verificar resposta'}).click();
 await expect(page.getByText('Vamos entender essa resposta.')).toBeVisible();await expect(page.getByText('Resposta esperada:')).toContainText('visited');
 await page.goto('/progress');await expect(page.getByRole('cell',{name:'worked',exact:true})).toBeVisible();
});
test('flashcards can be created, edited, reviewed and persist their next review',async({page})=>{
 await page.goto('/flashcards');await page.getByRole('button',{name:'Criar flashcard'}).click();
 await page.getByLabel('Palavra ou expressão').fill('seat belt');await page.getByLabel('Tradução ou significado').fill('cinto');
 await page.getByRole('button',{name:'Salvar cartão'}).click();await expect(page.getByRole('heading',{name:'seat belt'})).toBeVisible();
 await page.getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Tradução ou significado').fill('cinto de segurança');await page.getByRole('button',{name:'Salvar cartão'}).click();
 await page.getByRole('link',{name:'Começar revisão'}).click();await page.getByRole('button',{name:'Mostrar resposta'}).click();
 await expect(page.getByRole('heading',{name:'cinto de segurança'})).toBeVisible();await page.getByRole('button',{name:/^Lembrei/}).click();
 await expect(page.getByRole('heading',{name:'Você deu espaço para o conhecimento ficar.'})).toBeVisible();
 await page.reload();await expect(page.getByRole('heading',{name:'Nenhum cartão pendente agora.'})).toBeVisible();
});
test('vocabulary search saves real cards and local settings survive reload',async({page})=>{
 await page.goto('/vocabulary');await page.getByRole('textbox',{name:'Buscar palavras'}).fill('sink');await expect(page.getByRole('heading',{name:'sink',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Salvar: sink'}).click();await page.goto('/flashcards');await expect(page.getByRole('heading',{name:'sink',exact:true})).toBeVisible();
 await page.goto('/settings');await expect(page.getByText('Modo local',{exact:true})).toBeVisible();await page.getByLabel('Como podemos chamar você?').fill('João');await page.getByRole('button',{name:'Salvar perfil'}).click();
 await page.getByRole('button',{name:'Escuro',exact:true}).click();await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.getByLabel('Como podemos chamar você?')).toHaveValue('João');
});
test('diagnostic records a complete result using reserved questions',async({page})=>{
 await page.goto('/tests');await page.getByRole('button',{name:'Fazer diagnóstico'}).click();
 for(let i=0;i<12;i++){
  if(await page.locator('.choices>button').count())await page.locator('.choices>button').first().click();else await page.getByRole('textbox',{name:'Sua resposta'}).fill('a test answer');await page.getByRole('button',{name:'Verificar resposta'}).click();if(i===3){await page.reload();await expect(page.getByRole('button',{name:'Continuar',exact:true})).toBeVisible();}await page.getByRole('button',{name:'Continuar',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Um retrato do que você aprendeu.'})).toBeVisible();await page.reload();await expect(page.getByRole('cell',{name:'Diagnóstico inicial',exact:true})).toBeVisible();
});
test('backup export and validated import preserve data; invalid backup does not replace it',async({page})=>{
 await page.goto('/settings');await page.getByLabel('Como podemos chamar você?').fill('Marina');await page.getByRole('button',{name:'Salvar perfil'}).click();
 const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar JSON'}).click();const download=await downloaded;const path=await download.path();expect(path).toBeTruthy();
 await page.getByLabel('Arquivo de backup').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":99}')});await expect(page.getByRole('alert')).toContainText('Backup inválido');await expect(page.getByLabel('Como podemos chamar você?')).toHaveValue('Marina');
 await page.getByLabel('Arquivo de backup').setInputFiles(path!);await expect(page.getByText('Backup válido, pronto para mesclar')).toBeVisible();await page.getByRole('button',{name:'Mesclar backup'}).click();await page.reload();await expect(page.getByLabel('Como podemos chamar você?')).toHaveValue('Marina');
});
test('speaking without microphone, reading and video curation have usable alternatives',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'SpeechRecognition',{value:undefined});Object.defineProperty(window,'webkitSpeechRecognition',{value:undefined});});
 await page.goto('/speaking');await expect(page.getByRole('button',{name:'Falar e transcrever'})).toBeDisabled();await page.getByLabel('Sua transcrição ou resposta digitada').fill('I worked yesterday');await page.getByRole('button',{name:'Comparar palavras'}).click();await expect(page.getByRole('heading',{name:'Comparação de palavras'})).toBeVisible();
 await page.goto('/reading');await page.getByRole('button',{name:/Pequenos intervalos/}).click();await expect(page.getByText(/Lucas drives for a living/)).toBeVisible();
 await page.goto('/library');await expect(page.getByRole('heading',{name:'Vídeos em curadoria.'})).toBeVisible();
});
test('all navigation routes render without errors and mobile layout fits',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:390,height:844});
 for(const path of ['/','/course','/grammar','/vocabulary','/listening','/speaking','/reading','/writing','/flashcards','/reviews','/tests','/progress','/library','/settings','/session/5']){
  await page.goto(path);await expect(page.locator('main h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);
 }
 await page.getByRole('button',{name:'Abrir navegação'}).click();await expect(page.getByRole('navigation',{name:'Navegação principal'})).toBeVisible();await page.getByRole('link',{name:'Meu curso',exact:true}).click();await expect(page.locator('main h1')).toContainText('Seu inglês');expect(errors).toEqual([]);
});
test('production PWA opens after network goes offline',async({page,context})=>{
 await page.goto('/');await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();await expect(page.locator('main h1')).toBeVisible();await expect(page.getByText(/Você está offline/)).toBeVisible();await page.getByRole('link',{name:'Continuar estudando',exact:true}).click();await expect(page.getByRole('heading',{name:'Simple Past',exact:true,level:1})).toBeVisible();await context.setOffline(false);
});
test('a complete lesson records practice, final assessment and completion',async({page})=>{
 const lesson=lessons[0];
 const answer=async(e:typeof lesson.exercises[number])=>{
  if(e.options){const option=page.locator('.choices>button').filter({hasText:new RegExp(`^[A-D]${e.answers[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`)});await option.click();}
  else if(e.kind==='order'){for(const word of e.answers[0].split(' ')){await page.locator('.word-bank button:enabled').filter({hasText:new RegExp(`^${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`)}).first().click();}}
  else await page.getByRole('textbox',{name:'Sua resposta'}).fill(e.answers[0]);
  await page.getByRole('button',{name:'Verificar resposta'}).click();await expect(page.getByText('Muito bem! Você acertou.')).toBeVisible();await page.getByRole('button',{name:'Continuar',exact:true}).click();
 };
 await page.goto('/lesson/simple-past');await page.getByRole('button',{name:'Praticar o que aprendi'}).click();
 for(const e of lesson.exercises)await answer(e);
 await page.getByRole('button',{name:'Avaliar meu aprendizado'}).click();for(const e of lesson.assessment)await answer(e);
 await expect(page.getByRole('heading',{name:'Mais um passo no seu caminho.'})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Mais um passo no seu caminho.'})).toBeVisible();
 await page.goto('/');await expect(page.locator('.stat-card').filter({hasText:'Aulas concluídas'})).toContainText('01');
});
test('writing drafts and quick sessions resume after an immediate reload',async({page})=>{
 await page.goto('/writing');const field=page.getByRole('textbox',{name:'Seu texto em inglês'});await field.fill('Yesterday, I worked in the morning.');await page.reload();await expect(page.getByRole('textbox',{name:'Seu texto em inglês'})).toHaveValue('Yesterday, I worked in the morning.');
 await page.goto('/session/5');await page.locator('.choices>button').first().click();await page.getByRole('button',{name:'Verificar resposta'}).click();await page.reload();await expect(page.getByRole('button',{name:'Continuar',exact:true})).toBeVisible();await page.getByRole('button',{name:'Continuar',exact:true}).click();await expect(page.getByText('2 de 3 atividades')).toBeVisible();await page.reload();await expect(page.getByText('2 de 3 atividades')).toBeVisible();
});
