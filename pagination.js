const {searchQuery, filter , page = 1, pageSize = 2} = params;

   const skipAmount = (page - 1) * pageSize;
 .skip(skipAmount)
      .limit(pageSize)
  const totalQuestion = await Question.countDocuments(query);
    const isNext = totalQuestion > skipAmount + questions.length;