import pool from "../config/db.js";

export const createBooklistInDB=async({title,file_name,uploaded_by})=>{
    const[result]=await pool.query("Insert into booklists(title,file_name,uploaded_by) values(?,?,?)",[title,file_name,uploaded_by])
     return result.insertId;
}

export const getBooklistsFromDB=async()=>{
    const[rows]=await pool.query(
    `SELECT b.id, b.title, b.file_name, b.uploaded_by, t.name AS teacher_name, b.created_at
     FROM booklists b
     JOIN teachers t ON b.uploaded_by = t.id
     ORDER BY b.created_at DESC`

    );
    return rows;
};

export const deleteBooklistFromDB=async(id)=>{
    const[result]=await pool.query("DELETE FROM booklists WHERE id=?",[id]);
    return result.affectedRows > 0;
};

