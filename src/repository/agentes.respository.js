
class AgentesRepository{

    constructor() {
        // Asigna el valor a la propiedad de la instancia
        this.service = process.env.SERVICE || "http://localhost:8000";
        console.log(`Usando el servicio: ${this.service}`);
    }

    async getAgentes(){
        const url = this.service+'/api/agentes';
        let agentes = []; // Variable donde guardaremos el resultado
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
            }
            agentes = await response.json();        
            return agentes;
            
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
            throw new Error(`Error ${error}`);
        }
    }

    async showAgente(agente){
        const url = this.service+'/api/agentes/show/'+agente;
        let agentes = []; // Variable donde guardaremos el resultado
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
            }
            agentes = await response.json();        
            return agentes;
            
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
        } 
    }


    async addAgente(agente,nombre){
        const url = this.service+'/api/agentes/add/'+agente+'/'+nombre;
        let agentes = []; // Variable donde guardaremos el resultado
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
            }
            agentes = await response.json();        
            return agentes;
            
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
        } 
    }
}

export default new AgentesRepository();
