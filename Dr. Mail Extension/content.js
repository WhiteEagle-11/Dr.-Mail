
function createButton(){
    const button= document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight='8px';
    button.innerHTML='Dr. Mail';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
        
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

function findcomposeToolbar(){
    const selectors= [
        '.btC',
        '.aDh',
        '[role="toolbar" ]',
        '.gU.Up'
    ];
    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
}


function injectButton(){
    const existingButton= document.querySelector('.ai-reply-button');
    if(existingButton) existingButton.remove();

    const toolbar= findcomposeToolbar();
    if(!toolbar){
        console.log("Toolbar Not Found");
        return;
    }

    console.log("Toolbar Found");
    const button= createButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click',async () => {
        try {
            button.innerHTML = 'Generating...';
            button.style.pointerEvents = 'none';

            const emailContent= getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent : emailContent,
                    tone : "professional"
                })
            });

            if(!response.ok){
                throw new Error('API Request Failed');
            }

            const generatedreply= await response.text();
            const composeBox=document.querySelector('[role="textbox"][g_editable="true"]');
            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText', false, generatedreply);
            }
            else{
                console.error('Compose Box not Found');
            }
        } catch (error) {
            alert('Failed to Generate Reply');
            console.error(error);
        }
        finally{
            button.innerHTML = 'Dr. Mail';
            button.style.pointerEvents = 'auto';
        }
    })

    toolbar.insertBefore(button, toolbar.firstChild);
}

 const observer = new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes= Array.from(mutation.addedNodes);
        const hasComposedElemnets= addedNodes.some(node => node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        if(hasComposedElemnets){
            console.log("Compose Window Detected");
            setTimeout(injectButton,500);
        }
    }
 });

 observer.observe(document.body ,{
    childList:true,
    subtree:true
 }
);