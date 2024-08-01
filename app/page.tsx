import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { ProfileForm } from "@/components/profile-form"
import CoverImage from "./cover-image";
import Avatar from "./avatar";
import Date from "./date";
import { getAllPosts } from "@/lib/api";
import { draftMode } from "next/headers";
import MoreStories from "./more-stories";
import { client } from '../lib/client';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

var contentful = require('contentful');
function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: {
  title: string;
  coverImage: any;
  date: string;
  excerpt: string;
  author: any;
  slug: string;
}) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </section>
  );
}

export default async function IndexPage() {
  const { isEnabled } = draftMode();
  const allPosts = await getAllPosts(isEnabled);
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  var client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  });

  const postData=await client.getEntry('6DI5LRjZboauqOYqPk3ydA');
  //console.log(postData);

  const apolloClient = new ApolloClient({
    uri: `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    cache: new InMemoryCache(),
  });
  const postData1=await apolloClient.query({
    query: gql`query{
  postCollection(order: date_DESC) {
    items {
      slug
      title
      coverImage {
        url
      }
      date
      author {
        name
        picture {
          url
        }
      }
      excerpt
    }
  }
}`,
  });

  console.log(postData1);
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1>{postData1.data.postCollection.items[0].slug}</h1>
      <h2>{postData.fields.title}</h2>
      <div className="container mx-auto px-5">
      {heroPost && (
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      )}
      <MoreStories morePosts={morePosts} />
    </div>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
      <ProfileForm />
      </div>
    </section>
  )
}
