import { Command } from '@root/common';

export interface ChangeTitleOfPost extends Command {
}




import { z } from "zod";




const thing = z.object({
    id: z.string(),
    //name: z.string().optional(),
  }).strict();


//thing.required()
//satisfies z.ZodType<Command>;




type Thing = z.infer<typeof thing>; 