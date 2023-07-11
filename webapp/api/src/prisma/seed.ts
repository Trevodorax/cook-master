import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // Password hash for all users
  const hash = await argon.hash('aze');

  // User data
  const users = [
    {
      email: 'user1@cookmaster.site',
      firstName: 'John',
      lastName: 'Doe',
      userType: 'client',
      subscriptionLevel: 1,
    },
    {
      email: 'user2@cookmaster.site',
      firstName: 'Jane',
      lastName: 'Doe',
      userType: 'contractor',
      serviceType: 'courses',
      serviceCost: 50,
    },
    {
      email: 'user3@cookmaster.site',
      firstName: 'Alice',
      lastName: 'Smith',
      userType: 'client',
      subscriptionLevel: 2,
    },
    {
      email: 'user4@cookmaster.site',
      firstName: 'Bob',
      lastName: 'Smith',
      userType: 'contractor',
      serviceType: 'workshops',
      serviceCost: 70,
    },
    {
      email: 'user5@cookmaster.site',
      firstName: 'Charlie',
      lastName: 'Brown',
      userType: 'client',
      subscriptionLevel: 0,
    },
    {
      email: 'user6@cookmaster.site',
      firstName: 'Lucy',
      lastName: 'Brown',
      userType: 'contractor',
      serviceType: 'tastings',
      serviceCost: 100,
    },
    {
      email: 'user7@cookmaster.site',
      firstName: 'Steve',
      lastName: 'White',
      userType: 'client',
      subscriptionLevel: 1,
    },
    {
      email: 'user8@cookmaster.site',
      firstName: 'Laura',
      lastName: 'White',
      userType: 'contractor',
      serviceType: 'cooking shows',
      serviceCost: 200,
    },
    {
      email: 'user9@cookmaster.site',
      firstName: 'Tom',
      lastName: 'Black',
      userType: 'client',
      subscriptionLevel: 2,
    },
    {
      email: 'user10@cookmaster.site',
      firstName: 'Sara',
      lastName: 'Black',
      userType: 'contractor',
      serviceType: 'master classes',
      serviceCost: 150,
    },
  ];

  // Creating users
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        hash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType: userData.userType,
        locale: 'en', // Default locale
      },
    });

    // Creating related data depending on the user type
    if (userData.userType === 'client') {
      await prisma.client.create({
        data: {
          subscriptionLevel: userData.subscriptionLevel,
          fidelityPoints: 25,
          user: { connect: { id: user.id } },
        },
      });
    } else if (userData.userType === 'contractor') {
      await prisma.contractor.create({
        data: {
          serviceType: userData.serviceType,
          serviceCost: userData.serviceCost,
          user: { connect: { id: user.id } },
        },
      });
    }
  }

  const courses = [
    {
      name: 'Italian Cuisine Basics',
      description: 'Learn the basics of the Italian kitchen',
      contractorEmail: 'user2@cookmaster.site',
      clientEmails: [
        'user1@cookmaster.site',
        'user3@cookmaster.site',
        'user5@cookmaster.site',
      ],
      lessons: [
        {
          name: 'Pasta',
          description: 'Learn to make pasta',
          content: 'Some markdown content',
          index: 0,
        },
        {
          name: 'Pizza',
          description: 'Learn to make pizza',
          content: 'Some markdown content',
          index: 1,
        },
      ],
      events: [
        {
          type: 'workshop',
          name: 'Pasta Workshop',
          description: 'Make pasta',
          startTime: new Date(),
          durationMin: 60,
        },
      ],
    },
    {
      name: 'French Patisserie',
      description: 'Master the art of French desserts',
      contractorEmail: 'user4@cookmaster.site',
      clientEmails: ['user7@cookmaster.site', 'user9@cookmaster.site'],
      lessons: [
        {
          name: 'Macarons',
          description: 'Learn to make macarons',
          content: 'Some markdown content',
          index: 0,
        },
        {
          name: 'Croissants',
          description: 'Learn to make croissants',
          content: 'Some markdown content',
          index: 1,
        },
      ],
      events: [
        {
          type: 'workshop',
          name: 'Macarons Workshop',
          description: 'Make macarons',
          startTime: new Date(),
          durationMin: 90,
        },
      ],
    },
  ];

  for (const courseData of courses) {
    // Fetch contractor
    const contractor = await prisma.user.findUnique({
      where: { email: courseData.contractorEmail },
      select: { contractor: true },
    });
    if (!contractor?.contractor) {
      console.error(
        `Contractor with email ${courseData.contractorEmail} not found`,
      );
      continue;
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        name: courseData.name,
        description: courseData.description,
        contractorId: contractor.contractor.id,
      },
    });

    // Create lessons
    for (const lessonData of courseData.lessons) {
      await prisma.lesson.create({
        data: {
          ...lessonData,
          courseId: course.id,
        },
      });
    }

    // Assign clients to course
    for (const clientEmail of courseData.clientEmails) {
      const client = await prisma.user.findUnique({
        where: { email: clientEmail },
        select: { client: true },
      });
      if (!client?.client) {
        console.error(`Client with email ${clientEmail} not found`);
        continue;
      }

      await prisma.client.update({
        where: { id: client.client.id },
        data: { courses: { connect: { id: course.id } } },
      });
    }

    // Create events
    for (const eventData of courseData.events) {
      await prisma.event.create({
        data: {
          ...eventData,
          courseId: course.id,
          contractorId: contractor.contractor.id,
        },
      });
    }
  }

  // Create addresses for some clients
  const addressData = [
    {
      email: 'user1@cookmaster.site',
      data: {
        streetNumber: '123',
        streetName: 'Main Street',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
      },
    },
    {
      email: 'user3@cookmaster.site',
      data: {
        streetNumber: '456',
        streetName: 'Oak Street',
        city: 'Los Angeles',
        postalCode: '90001',
        country: 'USA',
      },
    },
  ];

  for (const data of addressData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { client: true },
    });
    if (!user || !user.client) {
      console.error(`Client with email ${data.email} not found`);
      continue;
    }

    await prisma.address.create({
      data: { ...data.data, client: { connect: { id: user.client.id } } },
    });
  }

  // Create ClientCourseProgress for some clients and courses
  const courseProgressData = [
    {
      clientEmail: 'user1@cookmaster.site',
      courseTitle: 'Italian Cuisine Basics',
      progression: 2,
    },
    {
      clientEmail: 'user3@cookmaster.site',
      courseTitle: 'French Patisserie',
      progression: 3,
    },
  ];

  for (const data of courseProgressData) {
    const client = await prisma.user.findUnique({
      where: { email: data.clientEmail },
      select: { client: true },
    });
    const course = await prisma.course.findFirstOrThrow({
      where: { name: data.courseTitle },
    });

    if (!client || !client.client || !course) {
      console.error(
        `Client with email ${data.clientEmail} or course with title ${data.courseTitle} not found`,
      );
      continue;
    }

    await prisma.clientCourseProgress.create({
      data: {
        clientId: client.client.id,
        courseId: course.id,
        progression: data.progression,
      },
    });
  }

  // Create Invoices for some clients
  const invoiceData = [
    { clientEmail: 'user1@cookmaster.site', total: 100 },
    { clientEmail: 'user3@cookmaster.site', total: 150 },
  ];

  for (const data of invoiceData) {
    const client = await prisma.user.findUnique({
      where: { email: data.clientEmail },
      select: { client: true },
    });

    if (!client || !client.client) {
      console.error(`Client with email ${data.clientEmail} not found`);
      continue;
    }

    await prisma.invoice.create({
      data: { clientId: client.client.id, total: data.total },
    });
  }

  // Create Premises with Rooms
  const premiseData = [
    {
      address: {
        streetNumber: '789',
        streetName: 'Maple Street',
        city: 'San Francisco',
        postalCode: '94101',
        country: 'USA',
      },
      rooms: [{ capacity: 20 }, { capacity: 30 }],
    },
    {
      address: {
        streetNumber: '101',
        streetName: 'Pine Street',
        city: 'San Francisco',
        postalCode: '94101',
        country: 'USA',
      },
      rooms: [{ capacity: 10 }],
    },
  ];

  for (const data of premiseData) {
    const address = await prisma.address.create({
      data: { ...data.address },
    });

    const premise = await prisma.premise.create({
      data: {
        address: { connect: { id: address.id } },
      },
    });

    for (const roomData of data.rooms) {
      await prisma.room.create({
        data: { premiseId: premise.id, ...roomData },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
