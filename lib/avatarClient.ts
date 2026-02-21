export async function generateAvatar(photoDataUrl: string): Promise<string | null> {
  try {
    const response = await fetch(photoDataUrl);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');
    
    const apiResponse = await fetch('/api/generate-avatar', {
      method: 'POST',
      body: formData,
    });
    
    const result = await apiResponse.json();
    
    if (result.success && result.avatarUrl) {
      console.log('Avatar generated successfully via Gemini');
      return result.avatarUrl;
    }
    
    if (result.fallback) {
      console.warn('Avatar generation failed, using fallback:', result.error);
    }
    
    return null;
  } catch (error) {
    console.error('Avatar generation failed:', error);
    return null;
  }
}

export async function generateAvatarWithFallback(photoDataUrl: string): Promise<string> {
  const avatarUrl = await generateAvatar(photoDataUrl);
  return avatarUrl || photoDataUrl;
}
