export default function iniciarAccordion() {
    const accordionList = document.querySelectorAll('[data-accordion="list"] dt');
    const ativar = 'ativo';
    if(accordionList.length){
        accordionList[0].classList.add(ativar);
        accordionList[0].nextElementSibling.classList.add(ativar);

        function ativarLista() {
            this.classList.toggle(ativar);
            this.nextElementSibling.classList.toggle(ativar);
        }

        accordionList.forEach((item) => {
            item.addEventListener('click', ativarLista);
        })
    }
}
