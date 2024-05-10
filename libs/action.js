'use server';
import { revalidatePath } from 'next/cache';
import { getMeal, saveMeal } from './meals';
import slugify from 'slugify';
import axios from 'axios';

const shareMeal = async (prevState, formData) => {
	const meal = {
		creator: formData.get('name'),
		creator_email: formData.get('email'),
		title: formData.get('title'),
		summary: formData.get('summary'),
		image: formData.get('image'),
		instructions: formData.get('instructions'),
	};

	const slug = slugify(meal.title);
	const slugIsExist = await getMeal(slug);

	if (slug === slugIsExist.slug) {
		return { message: 'Your meal has been served, please add other meal' };
	}

	if (!meal.title || meal.title.trim() === '') {
		return { message: 'Meal title cannot be empty' };
	}

	if (!meal.creator_email || !meal.creator_email.includes('@')) {
		return { message: 'Meal creator email cannot be empty or format email is invalid' };
	}

	await saveMeal(meal);
	revalidatePath('/meals');
};

async function signInAction(prevState, formData) {
	console.log('[signInAction]', formData);
	const email = formData.get('email');
	const password = formData.get('password');

	try {
		const res = await axios.post('http://localhost:2000/api/v1/auth/login', {
			email,
			password,
		});

		console.log('response sukses?');
		console.log(res.data);
		return res.data;
	} catch (err) {
		console.log('error :', err);
		return {
			message: err.response.data.message || 'An error occurred',
		};
	}
}

export { shareMeal, signInAction };
