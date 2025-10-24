
class AgentesRepository{

    async getAgentes(){
        const url = 'http://localhost:8000/api/agentes';
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

    async showAgente(agente){
        const url = 'http://localhost:8000/api/agentes/show/'+agente;
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
        const url = 'http://localhost:8000/api/agentes/add/'+agente+'/'+nombre;
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
