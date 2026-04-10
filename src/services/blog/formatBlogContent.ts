
import { BlogPost } from "@/types/blog";

// Fonction pour détecter si le contenu est du HTML
const isHtmlContent = (content: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(content);
};

// Fonction pour formater les titres avec le bon style
const formatTitle = (title: string): string => {
  return `<h2 class="text-2xl font-heading font-bold text-prisma-purple mb-6 mt-8">${title}</h2>`;
};

// Fonction pour formater les sous-titres
const formatSubtitle = (subtitle: string): string => {
  return `<h3 class="text-xl font-heading font-semibold text-prisma-purple/90 mb-4 mt-6">${subtitle}</h3>`;
};

// Fonction pour formater les paragraphes
const formatParagraph = (text: string): string => {
  // Détection des listes à puces
  if (text.trim().startsWith('•') || text.trim().startsWith('-')) {
    const items = text.split(/[•-]/).filter(item => item.trim());
    return `<ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">
      ${items.map(item => `<li>${item.trim()}</li>`).join('\n')}
    </ul>`;
  }

  // Formater les paragraphes normaux
  return `<p class="text-gray-700 mb-4 leading-relaxed">${text.trim()}</p>`;
};

// Fonction pour formater les sections spéciales
const formatSection = (title: string, content: string): string => {
  return `
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      ${formatTitle(title)}
      ${content}
    </div>
  `;
};

// Fonction principale pour formater le contenu texte en HTML
const formatTextToHtml = (content: string): string => {
  // Séparer le contenu en sections
  const sections = content.split(/\n={2,}\s*\n/);
  
  return sections.map(section => {
    const lines = section.split('\n');
    let formattedContent = '';
    let currentParagraph = '';

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Traiter les titres et sous-titres
      if (trimmedLine.startsWith('##')) {
        if (currentParagraph) {
          formattedContent += formatParagraph(currentParagraph);
          currentParagraph = '';
        }
        formattedContent += formatSubtitle(trimmedLine.replace(/^##\s*/, ''));
      } else if (trimmedLine.startsWith('#')) {
        if (currentParagraph) {
          formattedContent += formatParagraph(currentParagraph);
          currentParagraph = '';
        }
        formattedContent += formatTitle(trimmedLine.replace(/^#\s*/, ''));
      } else if (trimmedLine === '') {
        if (currentParagraph) {
          formattedContent += formatParagraph(currentParagraph);
          currentParagraph = '';
        }
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
      }
    });

    // Ajouter le dernier paragraphe s'il existe
    if (currentParagraph) {
      formattedContent += formatParagraph(currentParagraph);
    }

    return formattedContent;
  }).join('\n');
};

// Fonction améliorée pour préserver la structure HTML complète
const preserveHtmlStructure = (content: string): string => {
  if (!content) return "";
  
  // Si c'est déjà du HTML, nettoyer les classes potentiellement dupliquées
  const cleanedHtml = content
    .replace(/class="([^"]*)"/g, (match, classStr) => {
      // Supprimer les classes dupliquées
      const uniqueClasses = [...new Set(classStr.split(/\s+/))].join(' ');
      return `class="${uniqueClasses}"`;
    })
    // Assurer que les liens externes s'ouvrent dans un nouvel onglet
    .replace(/<a\s+href="(https?:\/\/[^"]+)"([^>]*)>/gi, (match, url, attrs) => {
      if (!attrs.includes('target=')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer"${attrs}>`;
      }
      return match;
    });
  
  return cleanedHtml;
};

// Fonction principale pour formater le contenu en HTML
export const formatContentToHtml = (content: string): string => {
  if (!content) return "";
  
  if (isHtmlContent(content)) {
    return preserveHtmlStructure(content);
  }
  
  return formatTextToHtml(content);
};

// Fonction principale pour générer le contenu formaté
export const generateFormattedContent = (post: BlogPost): string => {
  if (!post.content) {
    return '<p class="text-gray-500 italic">Aucun contenu disponible pour cet article.</p>';
  }
  
  const formattedContent = formatContentToHtml(post.content);
  
  return formattedContent;
};
