// =============================================================================
//  Seed de démonstration — Sans Limites
// -----------------------------------------------------------------------------
//  Crée quelques comptes de test, des publications, likes, commentaires,
//  abonnements et notifications, afin que le front affiche immédiatement du
//  contenu réel une fois connecté.
//
//  Lancement :  npm run db:seed   (script déjà présent dans package.json)
//  Idempotent : les utilisateurs sont « upsertés » ; le contenu n'est créé
//  que si la base ne contient encore aucune publication.
//
//  Comptes de test (mot de passe commun : « password123 ») :
//    - marie@sanslimites.fr
//    - thomas@sanslimites.fr
//    - sophie@sanslimites.fr
// =============================================================================

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'password123';

async function main() {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  // --- Utilisateurs (upsert par email) ---
  const marie = await prisma.user.upsert({
    where: { email: 'marie@sanslimites.fr' },
    update: {},
    create: {
      email: 'marie@sanslimites.fr',
      username: 'marie.dupont',
      name: 'Marie Dupont',
      passwordHash,
      bio: 'Marathonienne · les limites sont faites pour être dépassées 💪',
      location: 'Lyon, France',
      primarySport: 'Course à pied',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    },
  });

  const thomas = await prisma.user.upsert({
    where: { email: 'thomas@sanslimites.fr' },
    update: {},
    create: {
      email: 'thomas@sanslimites.fr',
      username: 'thomas.martin',
      name: 'Thomas Martin',
      passwordHash,
      bio: 'CrossFit & musculation 🔥',
      location: 'Paris, France',
      primarySport: 'CrossFit',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    },
  });

  const sophie = await prisma.user.upsert({
    where: { email: 'sophie@sanslimites.fr' },
    update: {},
    create: {
      email: 'sophie@sanslimites.fr',
      username: 'sophie.bernard',
      name: 'Sophie Bernard',
      passwordHash,
      bio: "Grimpeuse · la peur des hauteurs ? Connais pas 🧗‍♀️",
      location: 'Grenoble, France',
      primarySport: 'Escalade',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
  });

  // --- Abonnements (graphe social) ---
  await prisma.follow.createMany({
    data: [
      { followerId: thomas.id, followingId: marie.id },
      { followerId: sophie.id, followingId: marie.id },
      { followerId: marie.id, followingId: sophie.id },
    ],
    skipDuplicates: true,
  });

  // --- Contenu : créé seulement si la base est vide en publications ---
  const existingPosts = await prisma.post.count();
  if (existingPosts > 0) {
    console.log('ℹ️  Des publications existent déjà — seed de contenu ignoré.');
    return;
  }

  const post1 = await prisma.post.create({
    data: {
      authorId: marie.id,
      title: 'Record personnel au marathon',
      content:
        'Nouveau record personnel au marathon ! 3h45 💪 Les limites sont faites pour être dépassées !',
      imageUrl:
        'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop',
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: thomas.id,
      title: 'Session CrossFit',
      content:
        'Session de CrossFit intense ce matin ! Qui est motivé pour me rejoindre demain ? 🔥',
      imageUrl:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: sophie.id,
      title: 'Escalade en extérieur',
      content:
        "Escalade en extérieur aujourd'hui. La peur des hauteurs ? Connais pas ! 🧗‍♀️",
      imageUrl:
        'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=600&fit=crop',
    },
  });

  // --- Likes ---
  await prisma.like.createMany({
    data: [
      { userId: thomas.id, postId: post1.id },
      { userId: sophie.id, postId: post1.id },
      { userId: marie.id, postId: post3.id },
    ],
    skipDuplicates: true,
  });

  // --- Commentaires ---
  await prisma.comment.createMany({
    data: [
      { authorId: thomas.id, postId: post1.id, content: 'Bravo ! Quel temps incroyable 👏' },
      { authorId: sophie.id, postId: post1.id, content: 'Impressionnant, félicitations !' },
      { authorId: marie.id, postId: post2.id, content: 'Je viens demain ! À quelle heure ?' },
    ],
  });

  // --- Notifications (destinataire : Marie) ---
  await prisma.notification.createMany({
    data: [
      { recipientId: marie.id, actorId: thomas.id, type: 'LIKE', entityId: post1.id, content: '« Record personnel au marathon »' },
      { recipientId: marie.id, actorId: thomas.id, type: 'COMMENT', entityId: post1.id, content: '« Bravo ! Quel temps incroyable 👏 »' },
      { recipientId: marie.id, actorId: sophie.id, type: 'FOLLOW' },
    ],
  });

  console.log('✅ Seed terminé.');
  console.log(`   Comptes de test (mot de passe « ${DEMO_PASSWORD} ») :`);
  console.log('   - marie@sanslimites.fr');
  console.log('   - thomas@sanslimites.fr');
  console.log('   - sophie@sanslimites.fr');
}

main()
  .catch((e) => {
    console.error('❌ Erreur de seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
