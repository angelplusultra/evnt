import mongoose from "mongoose";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const useUserValidate = ({ id }) => {
	let error = false;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		error = true;
	}

	return { error };
};
