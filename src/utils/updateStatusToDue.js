import Borrow from "../models/borrow/borrow.model.js";
import moment from "moment";
import "dotenv/config";
import { connectDB } from "../config/db.js";
await connectDB(process.env.MONGO_URL);

export const  updateStatusToDue = async () => {
    try {
      const currentDate = moment();
      console.log(currentDate); // Get the current date
      const recordsToUpdate = await Borrow.find({
        returnDate: { $lt: currentDate },
        status: 'Borrowed', // Check for records with "borrowed" status
      });
      console.log(recordsToUpdate);

  
      for (const record of recordsToUpdate) {
        // Update the status to "due"
        record.status = 'Due';
        await record.save();
        console.log("Success");

      }
    } catch (error) {
      console.error('Error updating status to "due":', error);
    };
  };

  export const fineCalculator = async () => {
    try {
        const currentDate = moment(); 
        console.log(currentDate)// Get the current date
        const overdueRecords = await Borrow.find({
          returnDate: { $lt: currentDate },
          status: 'Due', // Check for records with "due" status
        });
        console.log(overdueRecords);

    
        for (const record of overdueRecords) {
          const daysOverdue = currentDate.diff(record.returnDate, 'days');
          const fineAmount = daysOverdue * 50; // Fine is 50 units per day overdue
    
          // Update the fine amount in the borrowing record
          record.fine = fineAmount;
          await record.save();
          console.log("Success");

        }
      } catch (error) {
        console.error('Error calculating fines:', error);
      };
  };
