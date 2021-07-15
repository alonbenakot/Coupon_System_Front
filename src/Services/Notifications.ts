import { Notyf } from "notyf";

class Notify {
    private notification = new Notyf({duration: 3000, position: {x: "left", y: "top" }, dismissible: true, types: [
        {
          type: 'success',
          background: "Gold",
        },
        {
            type: 'error',
            background: 'Crimson',
          
        }
      ]});

    public success(message: string) {
        this.notification.success(message);
    }
    public error(err: any) {
        let message = this.extractMessage(err);
        this.notification.error(message);

    }
    private extractMessage(err: any): string{
        
        if (typeof err === "string") {
            return err;
        }
        if (typeof err?.response?.data?.message === "string") {
            return err.response.data.message;
        }
        
        if (Array.isArray(err.response?.data)) {
            return err.response?.data[0];
        }
        // must be last
        if (typeof err?.message === "string") {
            return err.message;
        }
        return "Some error occurred, please try again."
    }
    
}
let notify = new Notify();
export default notify;